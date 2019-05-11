import React from 'react'
import { scaleLinear, ScaleLinear } from 'd3-scale'

import { mandelbrot } from '../lib/mandelbrot'
import { generateComplexGrid } from '../lib/generator-utils'
import {
  FEW_ITER,
  W,
  H,
  GRID_DENSITY,
  IVCords,
  GRID_EXTENT,
  MAX_M,
  MAX_ITER,
} from '../lib/constants'

import { drawCanvasFactory } from '../lib/canvas'
import { getCursorPosition, rescaleFromClick } from '../lib/ui'
import { throttle } from 'lodash'

const iterationsColorScale = scaleLinear<string, string>()
  .domain([0, 10])
  .range(FEW_ITER)

const gridGeneratorOnDensity = generateComplexGrid(GRID_DENSITY)

const drawCavas = drawCanvasFactory(gridGeneratorOnDensity, iterationsColorScale)

interface S {
  extent: IVCords
  xScale: ScaleLinear<number, number>
  yScale: ScaleLinear<number, number>
  magn: number
  iter: number
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

  _handleDoubleClick = (evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { extent, xScale, yScale } = this.state
    evt.preventDefault()
    const { x, y } = getCursorPosition(this.canvas.current, evt)
    const xValue = xScale.invert(x)
    const yValue = yScale.invert(y)

    const newExtent = rescaleFromClick(extent, [xValue, yValue], 0.5)
    this.setState({ extent: newExtent }, this.computeCanvas)
  }

  handleDoubleClick = throttle(this._handleDoubleClick, 500)

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

  render() {
    return (
      <div>
        <div className="flex flex-column w-10 mh4" />
        <button
          className="ma2"
          onClick={this.handleReset}
          style={{ userSelect: 'none' }}
        >{`Reset size`}</button>
        <canvas ref={this.canvas} width={W} height={H} onDoubleClick={this.handleDoubleClick} />
      </div>
    )
  }
}
