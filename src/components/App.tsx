import React from 'react'
import { generateGrid } from '../lib/generatorUtils';
import { mandelbrot, Complex } from "../lib/mandelbrot"
import { generateComplexGrid } from '../lib/generatorUtils'
import { mapMandelbrot } from '../lib/mapMandelset'

const MAX_ITER = 100
const MAX_M = 4

const divergeComplex = mandelbrot(MAX_ITER, MAX_M)
const grid = generateComplexGrid(10,10)

interface State {
  iteration: number
}

const rangeGenerator = generateGrid(10,10)

export class App extends React.Component<{}, State> {

  state = {
    iteration: 0
  }

  componentDidMount() {
    for (let i of mapMandelbrot(divergeComplex, grid)) {
      console.log(i)
    }
  }

  render() {
    const { iteration } = this.state

    return (
      <div>
        <h2>{iteration}</h2>
      </div>
    )
  }
}
