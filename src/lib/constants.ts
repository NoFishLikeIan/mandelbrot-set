export type IVCords = [number, number, number, number]

export const MAX_ITER = 10
export const MAX_M = 20
export const GRID_EXTENT: IVCords = [-3, 1, -2, 2] // [-0.41, 0, -1.32, -0.32] //
export const MAX_MAGN_SCALE = 3
export const MAX_MAGN_ITER = MAX_ITER

export const W = window.innerHeight - 10
export const H = ((GRID_EXTENT[3] - GRID_EXTENT[2]) / (GRID_EXTENT[1] - GRID_EXTENT[0])) * W

export const ITERATION_COLORS = ['#2980B9', '#000000', '#EC7063']
export const GRID_DENSITY = 500
export const fillW = W / GRID_DENSITY
export const fillH = H / GRID_DENSITY
export const TEXT_M = 20

export const A_LIST_OF_COLORS = [
  '#e6194b',
  '#3cb44b',
  '#ffe119',
  '#4363d8',
  '#f58231',
  '#911eb4',
  '#46f0f0',
  '#f032e6',
  '#bcf60c',
  '#fabebe',
  '#008080',
  '#e6beff',
  '#9a6324',
  '#fffac8',
  '#800000',
  '#aaffc3',
  '#808000',
  '#ffd8b1',
  '#000075',
  '#808080',
  '#ffffff',
  '#000000',
]
