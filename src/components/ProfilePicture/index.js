import React from 'react'
import './index.css'

export default function ProfilePictures({
  name,
  imgs,
  className,
  size = '13rem',
  onClick,
}) {
  let pics = []
  if (typeof imgs === 'object' && Object.entries(imgs).length) {
    function getOptimal(pxSize) {
      let available = Object.keys(imgs)
        .map(n => parseInt(n, 10))
        .map((v, i, a) => v || Infinity)
      let size = Math.min(...available.filter(n => n >= pxSize))
      if (size === Infinity)
        size = Math.max(...available.filter(n => n < pxSize))
      if (size < pxSize && available.includes(Infinity)) size = Infinity
      const selected = Object.entries(imgs[size !== Infinity ? size : 'max'])
      return [
        selected.find(([type]) => type === 'jpeg').pop(),
        selected.find(([type]) => type === 'webp').pop(),
      ]
    }

    const sizes = typeof size === 'string' ? [{ size }] : size
    pics = sizes.flatMap(({ size, min, max }) => {
      const media = [
        ...(min ? [['min', parseCSSSize(min)]] : []),
        ...(max ? [['max', parseCSSSize(max)]] : []),
      ]
        .map(([t, s]) => `(${t}-width: ${s}px)`)
        .join(' and ')

      return getOptimal(parseCSSSize(size)).map((url, i) => ({
        url,
        media,
        type: i === 0 ? 'jpeg' : 'webp',
      }))
    })
  } else pics.push({ url: imgs })

  return (
    <picture onClick={onClick}>
      {pics.map(({ url, type, media }) => (
        <source
          srcSet={url}
          type={`image/${type}`}
          media={media}
          key={url + media}
        />
      ))}
      <img
        src={pics[0].url}
        alt={name}
        className={className || 'mentor-profilepic'}
      />
    </picture>
  )
}

function parseCSSSize(size) {
  const value = parseInt(size)
  const unit = size.replace(/[0-9]/g, '')
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
