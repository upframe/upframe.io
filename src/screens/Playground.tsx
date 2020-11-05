import React from 'react'
import styled from 'styled-components'
import { Image, Img } from 'components'

const imgs: Img[] = [
  { width: 880, type: 'jpeg', key: 'cover-880x475.jpeg' },
  { width: 1760, type: 'jpeg', key: 'cover-1760x949.jpeg' },
  { width: 880, type: 'webp', key: 'cover-880x475.webp' },
  { width: 1760, type: 'webp', key: 'cover-1760x949.webp' },
]

export default function Playground() {
  return (
    <S.Playground>
      <Image
        base={`${process.env.REACT_APP_ASSETS}spaces/6edf801e-6f7c-4444-8743-2f47f8ed8865/`}
        imgs={imgs}
        width="(max-width: 880px) 100vw, 20rem"
        ratio={0.54}
      />
    </S.Playground>
  )
}

const S = {
  Playground: styled.div`
    padding: 2rem;
  `,
}
