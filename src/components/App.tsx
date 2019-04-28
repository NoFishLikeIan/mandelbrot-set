import React from 'react'
import { scaleLinear } from 'd3-scale'

import { mandelbrot, Complex } from "../lib/mandelbrot"
import { generateComplexGrid } from '../lib/generatorUtils'
import { mapMandelbrot } from '../lib/mapMandelset'

const MAX_ITER = 20
const MAX_M = 1000
const SIDE = 800
const FEW_ITER = ['#2980B9', '#EC7063']
const GRID_EXTENT: [number, number] = [-2, 2]
const GRID_DENSITY = 1000
const fillRectSize = SIDE / GRID_DENSITY

const iterationsColorScale =
  scaleLinear<string, string>().domain([0, 20]).range(FEW_ITER)

const plotScale = scaleLinear().domain(GRID_EXTENT).range([ 0, SIDE ])

const divergeComplex = mandelbrot(MAX_ITER, MAX_M)
const grid = generateComplexGrid(...GRID_EXTENT)(GRID_DENSITY)

export class App extends React.Component {
  canvas = React.createRef<HTMLCanvasElement>()

  componentDidMount() {
    const ctx = this.canvas.current.getContext('2d')

    for (let { iteration, c } of mapMandelbrot(divergeComplex, grid)) {
      const x = plotScale(c.re)
      const y = plotScale(c.im)
      const color = iterationsColorScale(iteration)
      ctx.fillStyle = color
      ctx.fillRect(x, y, fillRectSize, fillRectSize)
    }
  }

  render() {
    return (
      <div className="mh7">
        <canvas ref={this.canvas} width={SIDE} height={SIDE} />
      </div>
    )
  }
}
