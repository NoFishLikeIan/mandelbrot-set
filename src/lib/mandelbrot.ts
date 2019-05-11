import { reduceWhile } from './generator-utils'

export type Complex = {
  re: number
  im: number
}

const sqrt = Math.sqrt

const sum = (first: Complex, second: Complex): Complex => ({
  re: first.re + second.re,
  im: first.im + second.im,
})

const multiply = (first: Complex, second: Complex): Complex => ({
  re: first.re * second.re - first.im * second.im,
  im: first.re * second.im + second.re * first.im,
})

export const magn = (c: Complex) => sqrt(c.re * c.re + c.im * c.im)

const didDivergePast = (maxIter: number, maxMagn: number) => (
  iter: number,
  value: Complex
): boolean => iter < maxIter && magn(value) < maxMagn

function* sumSquareGenerator(z: Complex, c: Complex): IterableIterator<Complex> {
  while (1) {
    z = yield sum(multiply(z, z), c)
  }
}

export function mandelbrot(maxIter: number, maxMagn: number) {
  const diverges = didDivergePast(maxIter, maxMagn)
  const z0 = { re: 0, im: 0 }

  return (c: Complex) => {
    let iterator = sumSquareGenerator(z0, c)
    const { iteration } = reduceWhile(diverges, sum, z0, iterator)
    return { iteration, c }
  }
}

export type MandelbrotReturn = ReturnType<typeof mandelbrot>
