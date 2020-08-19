import React from 'react'
import styled from 'styled-components'
import { mobile } from 'styles/responsive'

export default function Home({ children }) {
  return (
    <S.Wrap>
      <S.Home>{children}</S.Home>
    </S.Wrap>
  )
}

const S = {
  Wrap: styled.div`
    width: 100vw;
    overflow-x: hidden;
    padding-bottom: 0.5rem;
  `,

  Home: styled.main`
    width: 55rem;
    margin: initial;
    margin-left: 15vw;
    min-height: 100vh;
    box-sizing: border-box;
    max-width: 95%;

    @media (max-width: 1020px) {
      margin: auto;
    }

    p {
      color: var(--slate-grey);
    }

    h2,
    h3 {
      font-weight: 500;
      color: #000;
    }

    @media ${mobile} {
      min-height: initial;
    }
  `,
}
