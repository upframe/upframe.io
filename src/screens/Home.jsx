import React from 'react'
import styled from 'styled-components'

export default function Home({ children }) {
  return <S.Home>{children}</S.Home>
}

const S = {
  Home: styled.main`
    width: 55rem;
    margin: initial;
    margin-left: 15vw;

    @media (max-width: 1020px) {
      margin: auto;
    }

    @media (max-width: 720px) {
      max-width: 95%;
    }

    p {
      color: var(--slate-grey);
    }

    h2,
    h3 {
      font-weight: 500;
      color: #000;
    }
  `,
}
