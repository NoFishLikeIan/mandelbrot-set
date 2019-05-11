import { Complex, magn } from './mandelbrot'

import { ScaleLinear } from 'd3'

import { mapMandelbrot } from './map-mandel-set'
import { IVCords, W, H, fillW, fillH } from './constants'

const getCoords = (xtn: IVCords, a: 'x' | 'y') => (a === 'x' ? [xtn[0], xtn[1]] : [xtn[2], xtn[3]])

export function drawCanvasFactory(
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
    context.clearRect(0, 0, W, H)

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
