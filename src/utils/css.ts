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

export function parseSize(size?: string): number {
  if (size === undefined) return undefined as any
  size = size.trim()
  if (typeof size === 'number') return size
  const value = parseFloat(size)
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

export const sizesToQueries = (sizes: string) =>
  ` width: ${sizes.split(',').pop()?.trim()};
    ${sizes
      .split(',')
      .slice(0, -1)
      .reverse()
      .map(v => {
        const [q, w] = v.split(/\s+(?=(\w+)$)/)
        return `@media ${q} {
          width: ${w};
        }`
      })
      .join('\n')}
`.replace(/(?:\n|^)\s+/g, '\n')

export const nthOfClass = (el: HTMLElement) =>
  Array.from(
    document.querySelectorAll(el.className.replace(/(^|\s)(?=\w)/g, '.'))
  ).indexOf(el)
