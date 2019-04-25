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