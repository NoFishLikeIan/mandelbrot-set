import * as tx from '@thi.ng/math'

import { IVCords } from './constants'
import { max } from 'lodash'

export const getYs = (extent: IVCords) => extent.slice(2, 4) as [number, number]
export const getXs = (extent: IVCords) => extent.slice(0, 2) as [number, number]

const interval = (d: number) => (x: number): [number, number] => [x - d, x + d]

export function getCursorPosition(
  canvas: HTMLCanvasElement,
  event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  return { x, y }
}

export function rescaleFromClick(
  extent: IVCords,
  clickValue: [number, number],
  reduce: number
): IVCords {
  const deltaYPrime = (tx.absDiff(...getYs(extent)) * reduce) / 2
  const deltaXPrime = (tx.absDiff(...getXs(extent)) * reduce) / 2
  const delta = max([deltaXPrime, deltaYPrime])
  const genInterval = interval(delta)

  const newYExtent = genInterval(clickValue[1])
  const newXExtent = genInterval(clickValue[0])

  return [newXExtent[0], newXExtent[1], newYExtent[0], newYExtent[1]]
}
