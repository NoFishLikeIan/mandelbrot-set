import React from 'react'
import { scaleLinear, ScaleLinear } from 'd3-scale'
import * as tx from '@thi.ng/math'

import { mandelbrot } from '../lib/mandelbrot'
import { generateComplexGrid } from '../lib/generator-utils'
import {
  ITERATION_COLORS,
  W,
  H,
  GRID_DENSITY,
  IVCords,
  GRID_EXTENT,
  MAX_M,
  MAX_ITER,
  MAX_MAGN_ITER,
  A_LIST_OF_COLORS,
} from '../lib/constants'

import { drawCanvasFactory } from '../lib/canvas'
import { getCursorPosition, rescaleFromClick } from '../lib/ui'
import { throttle, toNumber } from 'lodash'
import { insertAt } from '../lib/arr'
import { ControlPanel, SliderInput } from './control-panel'

const floor = Math.floor

const initColorRange: [number, number, number] = [0, MAX_MAGN_ITER / 3, MAX_MAGN_ITER]

const genInitColorScale = () =>
  scaleLinear<string, string>()
    .domain(initColorRange)
    .range(ITERATION_COLORS)

const gridGeneratorOnDensity = generateComplexGrid(GRID_DENSITY)

const drawCavas = drawCanvasFactory(gridGeneratorOnDensity)

interface S {
  extent: IVCords
  xScale: ScaleLinear<number, number>
  yScale: ScaleLinear<number, number>
  colorScale: ScaleLinear<string, string>
  magn: number
  iter: number
  newColors: string[]
  factor: number
  recompute: boolean
  click: number
}
export class App extends React.Component<{}, S> {
  state = {
    extent: GRID_EXTENT,
    xScale: scaleLinear().range([0, W]),
    yScale: scaleLinear().range([0, H]),
    colorScale: genInitColorScale(),
    newColors: A_LIST_OF_COLORS,
    recompute: true,
    iter: MAX_ITER,
    magn: MAX_M,
    factor: 1.1,
    click: 0.5,
  }

  canvas = React.createRef<HTMLCanvasElement>()

  _handleDoubleClick = (evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { extent, xScale, yScale, colorScale, newColors, factor, click } = this.state
    evt.preventDefault()
    const { x, y } = getCursorPosition(this.canvas.current, evt)
    const xValue = xScale.invert(x)
    const yValue = yScale.invert(y)

    const newExtent = rescaleFromClick(extent, [xValue, yValue], click)

    const currentDomain = colorScale.domain()
    const currentRange = colorScale.range()
    const rescaledDomain = currentDomain.map(n => n * factor)

    const [first, ...addColors] = newColors
    const n = floor(rescaledDomain.length / 2)

    const newDomain = insertAt(rescaledDomain, n, (rescaledDomain[n] + rescaledDomain[n + 1]) / 2)
    const newColorRange = insertAt(currentRange, n, first)

    const newColorScale = colorScale.domain(newDomain).range(newColorRange)
    this.setState(
      { extent: newExtent, colorScale: newColorScale, newColors: addColors, recompute: false },
      this.computeCanvas
    )
  }

  handleDoubleClick = throttle(this._handleDoubleClick, 500)

  handleReset = () =>
    this.setState(
      { extent: GRID_EXTENT, colorScale: genInitColorScale(), recompute: false },
      this.computeCanvas
    )

  handleFactor = (evt: SliderInput) => this.setState({ factor: toNumber(evt.target.value) })
  handleMagn = (evt: SliderInput) => this.setState({ magn: toNumber(evt.target.value) })
  handleClickF = (evt: SliderInput) => this.setState({ click: toNumber(evt.target.value) })
  handleIter = (evt: SliderInput) => this.setState({ iter: toNumber(evt.target.value) })
  handleRecompute = () => this.setState({ recompute: false }, this.computeCanvas)

  computeCanvas = () => {
    const { extent, magn, iter, xScale, yScale, colorScale } = this.state
    const ctx = this.canvas.current.getContext('2d')
    const { xScale: exitX, yScale: exitY } = drawCavas(
      mandelbrot(magn, iter),
      ctx,
      xScale,
      yScale,
      extent,
      colorScale
    )
    this.setState({ xScale: exitX, yScale: exitY, recompute: true })
  }

  componentDidMount() {
    this.computeCanvas()
  }

  render() {
    const { factor, magn, iter, recompute, click } = this.state
    const status = recompute ? 'Computed!' : 'Computing...'
    return (
      <div className="flex justify-between">
        <div className="flex flex-column">
          <ControlPanel
            handleFactor={{ fn: this.handleFactor, value: factor }}
            handleIter={{ fn: this.handleIter, value: iter }}
            handleMagn={{ fn: this.handleMagn, value: magn }}
            handleRecompute={this.handleRecompute}
            handleReset={this.handleReset}
            handleClickF={{ fn: this.handleClickF, value: click }}
          />
          {/* <div style={{ userSelect: 'none' }} className="ma4 f4 b">
            {status}
          </div> */}
        </div>

        <canvas
          className="mh4"
          ref={this.canvas}
          width={W}
          height={H}
          onDoubleClick={this.handleDoubleClick}
        />
      </div>
    )
  }
}
