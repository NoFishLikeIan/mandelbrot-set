import { Complex } from './mandelbrot'

export function reduceWhile<T, A>(
  predicate: (i: number, acc: A) => boolean,
  fn: (acc: A, value: T) => A,
  init: A,
  iterator: IterableIterator<T>
): { acc: A; iteration: number } {
  let acc = init
  let iteration = 0
  let it = iterator.next()

  do {
    const value = it.value
    acc = fn(acc, value)
    iteration++
    it = iterator.next(value)
  } while (predicate(iteration, acc) && !it.done)

  return {
    acc,
    iteration,
  }
}

export function* generateRange(n: number, m: number): IterableIterator<[number, number]> {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      yield [i, j]
    }
  }
}

function gridFactory(x0: number, x1: number, y0: number, y1: number) {
  const hint = x1 - x0
  const vint = y1 - y0
  return function*(size: number) {
    const hstep = hint / size
    const vstep = vint / size
    for (let i = 0; i <= size; i++) {
      for (let j = 0; j <= size; j++) {
        yield [x0 + hstep * i, y0 + vstep * j]
      }
    }
  }
}

export function generateComplexGrid(size: number) {
  return function*(x0: number, x1: number, y0: number, y1: number): IterableIterator<Complex> {
    const grid = gridFactory(x0, x1, y0, y1)(size)
    for (let tuple of grid) {
      yield { re: tuple[0], im: tuple[1] }
    }
  }
}

export function* mapIterator<I, O>(iterator: IterableIterator<I>, fn: IterableIterator<O>) {
  for (let input of iterator) {
    yield fn.next(input)
  }
}
