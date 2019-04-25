import { Complex } from "./mandelbrot";

export function * mapMandelbrot(mandelbrotFn: (c: Complex) => number, grid: IterableIterator<Complex>) {
  for (let c of grid) {
    yield mandelbrotFn(c)
  }
}