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

export function * generateGrid(n: number, m: number): IterableIterator<[number, number]> {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      yield [i, j]
    }
  }
}

export function * generateComplexGrid(n: number, m: number): IterableIterator<Complex> {
  const grid = generateGrid(n,m)
  for (let tuple of grid) {
    yield { re: tuple[0], im: tuple[1] }
  }
}