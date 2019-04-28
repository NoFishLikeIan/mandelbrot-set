import { Complex } from "./mandelbrot";

export function reduceWhile<T, A>(
  predicate: (i: number, acc: A) => boolean,
  fn: (acc: A, value: T) => A,
  init: A,
  iterator: IterableIterator<T>
  ): {acc: A, iteration: number} {
  let acc = init
  let iteration = 0
  let it = iterator.next()

  do {
    let value = it.value
    acc = fn(acc, value)
    iteration ++
    it = iterator.next(value)
  } while (predicate(iteration, acc) && !it.done)

  return {
    acc,
    iteration
  }
}

export function * generateRange(n: number, m: number): IterableIterator<[number, number]> {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      yield [i, j]
    }
  }
}

function gridFactory(from: number, to: number) {
  const interval = to - from
  return function * (size: number) {
    const step = interval / size

    for (let i = 0; i <= size; i++) {
      for (let j = 0; j <= size; j++) {
        yield [from + step * i, from + step * j]
      }
    }
  }
}

export function generateComplexGrid(from: number, to: number): (size: number) => IterableIterator<Complex> {
  const gridder = gridFactory(from, to)
  return function * (size: number) {
    const grid = gridder(size)
    for (let tuple of grid) {
      yield { re: tuple[0], im: tuple[1] }
    }
  }
}

export function * mapIterator<I, O>(iterator: IterableIterator<I>, fn: IterableIterator<O>) {
  for (let input of iterator) {
    yield fn.next(input)
  }
}