export const classes = (...classes) =>
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
