import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

export default function Identicon({ ids, size = 5 }) {
  const [id, setId] = useState()
  const [grid, setGrid] = useState()
  const ref = useRef()

  useEffect(() => {
    setId(mergeIds(ids))
  }, [ids])

  useEffect(() => {
    if (!id) return
    setGrid(generate(id, size))
  }, [id, size])

  useEffect(() => {
    if (!ref.current || !grid) return

    const ctx = ref.current.getContext('2d')
    ctx.fillStyle = '#f00'

    const clRange = 200
    const n = (id.length / 3) | 0
    ctx.fillStyle =
      '#' +
      id
        .match(new RegExp(`.{${n}}`, 'g'))
        .map(v =>
          ((parseInt(v, 16) % clRange) + (256 - clRange) / 2).toString(16)
        )
        .join('')

    for (const y in grid)
      for (const x in grid[y]) if (grid[y][x]) ctx.fillRect(x, y, 1, 1)
  }, [grid, ref, id])

  return <S.Identicon width={size} height={size} ref={ref} />
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
    let segs = [a, b].map(v => v.split('-').pop().match(/.{2}/g))
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

const S = {
  Identicon: styled.canvas`
    width: 3rem;
    height: 3rem;
    image-rendering: pixelated;
  `,
}
