import React from 'react'
import { scaleLinear, ScaleLinear } from 'd3-scale'
import { debounce } from 'lodash'

import { mandelbrot, Complex, magn } from '../lib/mandelbrot'
import { generateComplexGrid } from '../lib/generatorUtils'
import { mapMandelbrot } from '../lib/mapMandelset'

type IVCords = [number, number, number, number]

const MAX_ITER = 10
const MAX_M = 5
const GRID_EXTENT: IVCords = [-2, 2, -2, 2]

const W = window.innerHeight - 10
const H = ((GRID_EXTENT[3] - GRID_EXTENT[2]) / (GRID_EXTENT[1] - GRID_EXTENT[0])) * W

const FEW_ITER = ['#2980B9', '#EC7063']
const GRID_DENSITY = 500
const fillW = W / GRID_DENSITY
const fillH = H / GRID_DENSITY

const iterationsColorScale = scaleLinear<string, string>()
  .domain([0, 10])
  .range(FEW_ITER)

const xScale = scaleLinear().range([0, W])
const yScale = scaleLinear().range([0, H])

const getCoords = (xtn: IVCords, a: 'x' | 'y') => (a === 'x' ? [xtn[0], xtn[1]] : [xtn[2], xtn[3]])

const gridGeneratorOnDensity = generateComplexGrid(GRID_DENSITY)

function drawCanvasFactory(
  gridGen: (x0: number, x1: number, y0: number, y1: number) => IterableIterator<Complex>,
  colorScale: ScaleLinear<string, string>
) {
  return (
    diverge: (c: Complex) => { iteration: number; c: Complex },
    context: CanvasRenderingContext2D,
    xScale: ScaleLinear<number, number>,
    yScale: ScaleLinear<number, number>,
    extent: IVCords
  ) => {
    const grid = gridGen(...extent)
    const pltScaleX = xScale.domain(getCoords(extent, 'x'))
    const pltScaleY = yScale.domain(getCoords(extent, 'y'))
    let maxIter: number = 0
    let maxMagn: number = 0

    for (let { iteration, c } of mapMandelbrot(diverge, grid)) {
      context.fillStyle = colorScale(iteration)
      maxIter = Math.max(iteration, maxIter)
      maxMagn = Math.max(magn(c), maxMagn)
      context.fillRect(pltScaleX(c.re), pltScaleY(c.im), fillW, fillH)
    }
    return { xScale: pltScaleX, yScale: pltScaleY }
  }
}

const drawCavas = drawCanvasFactory(gridGeneratorOnDensity, iterationsColorScale)

interface S {
  extent: IVCords
  xScale: ScaleLinear<number, number>
  yScale: ScaleLinear<number, number>
  magn: number
  iter: number
}

function getCursorPosition(
  canvas: HTMLCanvasElement,
  event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  return { x, y }
}

export class App extends React.Component<{}, S> {
  state = {
    extent: GRID_EXTENT,
    xScale: scaleLinear().range([0, W]),
    yScale: scaleLinear().range([0, H]),
    magn: MAX_M,
    iter: MAX_ITER,
  }

  canvas = React.createRef<HTMLCanvasElement>()

  handleDoubleClick = (evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { extent, xScale, yScale } = this.state
    evt.preventDefault()
    const { x, y } = getCursorPosition(this.canvas.current, evt)
    const xScaled = xScale.invert(x)
    const yScaled = yScale.invert(y)

    const newExtentDistance = (extent[1] - extent[0]) * 0.2

    // const leftD = xScaled - extent[0]
    // const rightD = extent[1] - xScaled

    // const newLD = leftD * (1 - 0.8)
    // const newRD = rightD * (1 - 0.8)

    // const newExtent: [number, number] = [yScaled - newLD, xScaled + newRD]
    // console.log(leftD, rightD, newExtent)

    // this.setState({extent: newExtent}, this.computeCanvas)
  }

  computeCanvas() {
    const { extent, magn, iter, xScale, yScale } = this.state
    const ctx = this.canvas.current.getContext('2d')
    const { xScale: exitX, yScale: exitY } = drawCavas(
      mandelbrot(magn, iter),
      ctx,
      xScale,
      yScale,
      extent
    )
    this.setState({ xScale: exitX, yScale: exitY })
  }

  componentDidMount() {
    this.computeCanvas()
  }

  handleReset = () => this.setState({ extent: GRID_EXTENT }, this.computeCanvas)

  handleChange = (t: 'magn' | 'iter') => {
    const v =
      t === 'magn'
        ? (evt: React.ChangeEvent<HTMLInputElement>) =>
            this.setState({ magn: Number(evt.target.value) }, this.computeCanvas)
        : (evt: React.ChangeEvent<HTMLInputElement>) =>
            this.setState({ iter: Number(evt.target.value) }, this.computeCanvas)

    return v
  }

  render() {
    const { magn, iter } = this.state

    return (
      <div>
        <div className="flex flex-column w-10 mh4">
          {/* <input type="range" min="1" max="250" value={magn} onChange={this.handleChange('magn')} />
          <input type="range" min="1" max="250" value={iter} onChange={this.handleChange('iter')} /> */}
        </div>
        <button className="ma2" onClick={this.handleReset}>{`Reset size`}</button>
        <canvas ref={this.canvas} width={W} height={H} onDoubleClick={this.handleDoubleClick} />
      </div>
    )
  }
}
