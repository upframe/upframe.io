import React from 'react'
import styled from 'styled-components'
import { useComputed } from 'utils/hooks'
import { parseSize, sizesToQueries } from 'utils/css'

interface Props {
  base?: string
  imgs: Img[]
  alt?: string
  width?: string
  ratio?: number
}

export type Img = {
  width?: number
  height?: number
  type: 'png' | 'jpeg' | 'webp'
  key: string
}

type ByType = {
  [k in Img['type']]?: Img[]
}

const sortByType = (imgs: Img[]): ByType =>
  imgs.reduce(
    (acc, img) => ({ ...acc, [img.type]: [...(acc[img.type] ?? []), img] }),
    {}
  )

const formatPrecedence: Img['type'][] = ['webp', 'jpeg', 'png']

export default function Image({ base, imgs, alt = '', width, ratio }: Props) {
  const byType = useComputed(imgs, sortByType)
  const pxWidth = useComputed(width?.split(',')?.pop(), parseSize)

  return (
    <S.Picture queries={width && sizesToQueries(width)}>
      {(Object.entries(byType) as [Img['type'], Img[]][])
        .sort(
          ([f1], [f2]) =>
            formatPrecedence.indexOf(f1) - formatPrecedence.indexOf(f2)
        )
        .map(([type, imgs]) => (
          <source
            key={type}
            srcSet={imgs
              .map(({ width, key }) => `${base}${key} ${width}w`)
              .join(',')}
            sizes={width}
          />
        ))}
      <img
        alt={alt}
        width={pxWidth}
        height={width && ratio && pxWidth * ratio}
      />
    </S.Picture>
  )
}

const S = {
  Picture: styled.picture<{ queries?: string }>`
    display: contents;

    img {
      max-width: 100%;
      height: auto;

      /* stylelint-disable-next-line */
      ${({ queries }) => queries || ''}
    }
  `,
}
