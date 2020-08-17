export const classes = (...classes: string[]): string =>
  classes
    .flatMap(c =>
      c === undefined
        ? []
        : typeof c === 'string'
        ? c
        : Object.entries(c)
            .filter(([, v]) => v)
            .map(([k]) => k)
    )
    .join(' ')

export function parseSize(size: string): number {
  if (typeof size === 'number') return size
  const value = parseInt(size)
  const unit = size.replace(/[0-9.]/g, '')
  switch (unit) {
    case 'px':
      return value
    case 'rem':
      return (
        parseFloat(getComputedStyle(document.documentElement).fontSize) * value
      )
    default:
      throw Error(`unknown unit ${unit}`)
  }
}
