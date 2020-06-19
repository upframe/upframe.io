export default function Identicon({ ids }) {
  const id = mergeIds(ids)

  const grid = generate(id)

  console.log(
    grid.map(row => row.map(v => (v ? 'x' : ' ')).join(' ')).join('\n')
  )

  return null
}

const generate = (id, n = 5) => {
  let s = ((n / 2) | 0) + 1
  const fields = Array(s * n)
    .fill()
    .map((_, i) => {
      i = i % (id.length - 1)
      return parseInt(id.slice(i, i + 2), 16) % 2
    })
  return Array(n)
    .fill()
    .map((_, ri) =>
      Array(n)
        .fill()
        .map((_, ci) => fields[ri * s + (ci < s ? ci : s - (ci - (s - 2)))])
    )
}

const mergeIds = (ids = []) => {
  const merge = (a, b) => {
    let combined = []
    let segs = [a, b].map(v =>
      v
        .split('-')
        .pop()
        .match(/.{2}/g)
    )
    segs = Array(Math.min(segs[0].length, segs[1].length))
      .fill()
      .map((_, i) => [segs[0][i], segs[1][i]])

    for (const [s1, s2] of segs) {
      combined.push(
        (parseInt(s1, 16) + parseInt(s2, 16)).toString(16).slice(-2)
      )
    }
    return combined.join('')
  }
  let tmp = [...ids]
  while (tmp.length > 1) {
    tmp[0] = merge(tmp[0], tmp[1])
    tmp.pop()
  }
  return tmp[0]
}
