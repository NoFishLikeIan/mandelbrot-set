export function insertAt<T>(arr: T[], n: number, item: T): T[] {
  const copy = [...arr]
  copy.splice(n, 0, item)
  return copy
}
