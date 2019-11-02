import React from 'react'
import { useMatchMedia } from '../../utils/Hooks'
import './index.css'

export default function ProfilePictures({ name, imgs, className }) {
  const isBig = useMatchMedia('(max-width: 720px)')
  if (isBig === null) return null
  let jpeg = imgs
  let webp

  if (typeof imgs === 'object' && Object.entries(imgs).length) {
    const pxSize =
      parseFloat(getComputedStyle(document.documentElement).fontSize) *
      (isBig ? 18 : 13)

    let sizes = Object.keys(imgs)
      .map(n => parseInt(n, 10))
      .map((v, i, a) => v || Infinity)

    let size = Math.min(...sizes.filter(n => n >= pxSize))
    if (size === Infinity) size = Math.max(...sizes.filter(n => n < pxSize))
    if (size < pxSize && sizes.includes(Infinity)) size = Infinity

    const pics = Object.entries(imgs[size !== Infinity ? size : 'max'])
    jpeg = pics.find(([type]) => type === 'jpeg').pop()
    webp = pics.find(([type]) => type === 'webp').pop()
  }

  return (
    <picture>
      {webp && <source srcSet={webp} type={`image/webp`} key={webp} />}
      <source srcSet={jpeg} type={`image/jpeg`} key={jpeg} />
      <img src={jpeg} alt={name} className={className || 'mentor-profilepic'} />
    </picture>
  )
}
