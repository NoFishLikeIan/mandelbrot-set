export function reduceWhile<T, A>(
  predicate: (i: number, acc: A) => boolean,
  fn: (acc: A, value: T) => A,
  init: A,
  iterator: IterableIterator<T>
  ): {acc: A, iteration: number} {
  let acc = init
  let iteration = 0

  while (predicate(iteration, acc)) {
    let value = iterator.next().value
    try {
      acc = fn(acc, value)
    } catch (err) {
      debugger
    }
    iteration++
  }

  return {
    acc,
    iteration
  }
}