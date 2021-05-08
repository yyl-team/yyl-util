/** async forEach */
export async function forEach<T = any>(
  arr: T[],
  fn: (item: T, index: number) => Promise<boolean | undefined>
) {
  for (let i = 0, len = arr.length; i < len; i++) {
    if ((await fn(arr[i], i)) === true) {
      break
    }
  }
}
