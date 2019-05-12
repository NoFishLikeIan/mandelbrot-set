import { ScaleLinear } from 'd3'
import * as tx from '@thi.ng/math'

import { Complex, magn } from './mandelbrot'
import { mapMandelbrot } from './map-mandel-set'
import { IVCords, W, H, fillW, fillH, TEXT_M } from './constants'
import { toString, round } from 'lodash'
import { getXs, getYs } from './ui'

const max = Math.max
const getCoords = (xtn: IVCords, a: 'x' | 'y') => (a === 'x' ? [xtn[0], xtn[1]] : [xtn[2], xtn[3]])

function fillAxisText(context: CanvasRenderingContext2D, extent: IVCords) {
  context.font = '20px Georgia'
  context.fillStyle = 'white'

  const xs = getXs(extent)
    .map(n => round(n, 2))
    .map(toString)

  context.fillText(xs[0], TEXT_M, H / 2)
  context.fillText(xs[1], W - TEXT_M, H / 2)

  const ys = getYs(extent)
    .map(n => round(n, 2))
    .map(toString)

  context.fillText(ys[0], W / 2, TEXT_M)
  context.fillText(ys[1], W / 2, H - TEXT_M)
}

export function drawCanvasFactory(
  gridGen: (x0: number, x1: number, y0: number, y1: number) => IterableIterator<Complex>
) {
  return (
    diverge: (c: Complex) => { iteration: number; c: Complex },
    context: CanvasRenderingContext2D,
    xScale: ScaleLinear<number, number>,
    yScale: ScaleLinear<number, number>,
    extent: IVCords,
    colorScale: ScaleLinear<string, string>
  ) => {
    context.clearRect(0, 0, W, H)

    const grid = gridGen(...extent)
    const pltScaleX = xScale.domain(getCoords(extent, 'x'))
    const pltScaleY = yScale.domain(getCoords(extent, 'y'))
    let maxIter = 0
    let maxMagn = 0
    for (const { iteration, c } of mapMandelbrot(diverge, grid)) {
      maxIter = max(iteration, maxIter)
      maxMagn = max(maxMagn, magn(c))
      context.fillStyle = colorScale(iteration)
      context.fillRect(pltScaleX(c.re), pltScaleY(c.im), fillW, fillH)
    }

    fillAxisText(context, extent)
    return { xScale: pltScaleX, yScale: pltScaleY }
  }
}
