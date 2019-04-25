import { reduceWhile } from '../lib/generatorUtils'

export type Complex = {
  re: number,
  im: number
}

const sqrt = Math.sqrt

const logComplex = (c: Complex) => console.log(`${c.re} ${c.im > 0 ? '+' : '-'} ${c.re}`)

const sum = (first: Complex, second: Complex): Complex => ({ re: first.re + second.re, im: first.im + second.im })

const multiply = (first: Complex, second: Complex): Complex => ({
    re: first.re * second.re - first.im * second.im,
    im: first.re * second.im + second.re * first.im
  })

const magn = (c: Complex) => sqrt(c.re*c.re + c.im*c.im)

const didDivergePast =
  (maxIter: number, maxMagn: number) =>
    (iter: number, value: Complex): boolean => iter < maxIter || magn(value) > maxMagn

export function mandelbort(maxIter: number, maxMagn: number) {
  const diverges = didDivergePast(maxIter, maxMagn)
  const z0 = { re: 0, im: 0 }

  return (c: Complex) => {
    function* iterate(z: Complex): IterableIterator<Complex> {
      const zPrime: Complex = yield sum(multiply(z, z), c)
      iterate(zPrime)
    }
    let iterator = iterate(z0)
    const { iteration } = reduceWhile(diverges, sum, z0, iterator)

    return iteration
  }
}