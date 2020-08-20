import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { parseSize } from 'utils/css'
import Link from './Link'

type Props = {
  imgs: Img[] | undefined | null
  size?: string
  linkTo?: string
}

type Img = {
  url: string
  size?: number | null
  type?: 'webp' | 'jpeg' | string | null
}

export default function ProfilePicture({
  imgs,
  size = '13rem',
  linkTo,
}: Props) {
  const [pxSize, setPxSize] = useState(parseSize(size))
  const [pics, setPics] = useState<Img[]>([])
  const [fallback, setFallback] = useState<string>('')

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
    if (optimalSize === -Infinity || optimalSize === Infinity)
      optimalSize = Math.max(...pool.map(({ size }) => size))

    const selection = pool
      .filter(({ size }) => (size || Infinity) === optimalSize)
      .sort(({ type }) => (type === 'webp' ? -1 : 1))

    setPics(selection)
    setFallback(selection.slice(-1)[0]?.url)
  }, [pxSize, imgs])

  return (
    <Link disable={!linkTo} to={linkTo} wrap>
      <S.Picture>
        {pics.map(({ type, url }) => (
          <source srcSet={url} type={`image/${type}`} key={url} />
        ))}
        <img
          src={fallback}
          alt="profile"
          width={parseSize(size)}
          height={parseSize(size)}
        />
      </S.Picture>
    </Link>
  )
}

const S = {
  Picture: styled.picture`
    display: contents;

    img {
      object-fit: cover;
    }

    source {
      display: none;
    }
  `,

  Link: styled(Link)`
    display: contents;
  `,
}
