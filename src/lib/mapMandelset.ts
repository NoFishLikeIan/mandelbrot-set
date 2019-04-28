import { Complex, MandelbrotReturn } from "./mandelbrot";

export function * mapMandelbrot(mandelbrotFn: MandelbrotReturn, grid: IterableIterator<Complex>) {
  for (let c of grid) {
    yield mandelbrotFn(c)
  }
}