export type IVCords = [number, number, number, number]

export const MAX_ITER = 10
export const MAX_M = 5
export const GRID_EXTENT: IVCords = [-2, 2, -2, 2]

export const W = window.innerHeight - 10
export const H = ((GRID_EXTENT[3] - GRID_EXTENT[2]) / (GRID_EXTENT[1] - GRID_EXTENT[0])) * W

export const FEW_ITER = ['#2980B9', '#EC7063']
export const GRID_DENSITY = 10
export const fillW = W / GRID_DENSITY
export const fillH = H / GRID_DENSITY
export const TEXT_M = 15
