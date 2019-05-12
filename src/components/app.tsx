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
import { throttle } from 'lodash'
import { insertAt } from '../lib/arr'

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
}
export class App extends React.Component<{}, S> {
  state = {
    extent: GRID_EXTENT,
    xScale: scaleLinear().range([0, W]),
    yScale: scaleLinear().range([0, H]),
    magn: MAX_M,
    iter: MAX_ITER,
    colorScale: genInitColorScale(),
    newColors: A_LIST_OF_COLORS,
  }

  canvas = React.createRef<HTMLCanvasElement>()

  _handleDoubleClick = (evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { extent, xScale, yScale, colorScale, newColors } = this.state
    evt.preventDefault()
    const { x, y } = getCursorPosition(this.canvas.current, evt)
    const xValue = xScale.invert(x)
    const yValue = yScale.invert(y)

    const newExtent = rescaleFromClick(extent, [xValue, yValue], 0.5)

    const currentDomain = colorScale.domain()
    const currentRange = colorScale.range()
    const rescaledDomain = currentDomain.map(n => n * 1.1)

    const [first, ...addColors] = newColors
    const n = floor(rescaledDomain.length / 2)

    const newDomain = insertAt(rescaledDomain, n, (rescaledDomain[n] + rescaledDomain[n + 1]) / 2)
    const newColorRange = insertAt(currentRange, n, first)

    console.log('range: ', ...newColorRange)
    console.log('domain: ', ...newDomain)

    const newColorScale = colorScale.domain(newDomain).range(newColorRange)
    this.setState(
      { extent: newExtent, colorScale: newColorScale, newColors: addColors },
      this.computeCanvas
    )
  }

  handleDoubleClick = throttle(this._handleDoubleClick, 500)

  computeCanvas() {
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
    this.setState({ xScale: exitX, yScale: exitY })
  }

  componentDidMount() {
    this.computeCanvas()
  }

  handleReset = () =>
    this.setState({ extent: GRID_EXTENT, colorScale: genInitColorScale() }, this.computeCanvas)

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
