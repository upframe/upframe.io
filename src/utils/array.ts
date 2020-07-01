export function haveSameContent(arr1, arr2, comp = (a, b) => a === b) {
  if (arr1.length !== arr2.length) return false
  const arr2Cp = arr2.slice(0)
  return arr1.every(e1 => {
    const i = arr2Cp.findIndex(e2 => comp(e1, e2))
    return i === -1 ? false : (arr2Cp.splice(i, 1), true)
  })
}

export const compose = (
  input: [any, any][],
  cond: (c: any, v?: any) => boolean = c => !!c
): any[] => input.flatMap(([c, v]) => (cond(c, v) ? [v] : []))
