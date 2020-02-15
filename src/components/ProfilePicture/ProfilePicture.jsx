import React, { useState, useEffect } from 'react'
import { parseSize } from '../../utils/css'

export default function ProfilePicture({ imgs, size = '13rem' }) {
  const [pxSize, setPxSize] = useState(parseSize(size))
  const [pics, setPics] = useState([])
  const [fallback, setFallback] = useState('')

  useEffect(() => {
    setPxSize(parseSize(size))
  }, [size])

  useEffect(() => {
    if (!Array.isArray(imgs) || imgs.length === 0) return

    let pool = imgs.map(({ size, ...img }) => ({
      size: size || Infinity,
      ...img,
    }))

    let optimalSize = Math.min(
      ...pool
        .filter(({ size }) => size >= pxSize * devicePixelRatio)
        .map(({ size }) => size)
    )
    if (optimalSize === -Infinity)
      optimalSize = Math.max(...pool.map(({ size }) => size))

    const selection = pool
      .filter(({ size }) => (size || Infinity) === optimalSize)
      .sort(({ type }) => (type === 'webp' ? -1 : 1))

    setPics(selection)
    setFallback(selection.slice(-1)[0].url)
  }, [pxSize, imgs])

  return (
    <picture>
      {pics.map(({ type, url }) => (
        <source srcSet={url} type={`image/${type}`} key={url} />
      ))}
      <img src={fallback} alt="profile" />
    </picture>
  )
}
