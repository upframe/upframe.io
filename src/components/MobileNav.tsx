import React from 'react'
import styled from 'styled-components'
import { desktop } from 'styles/responsive'
import layout from 'styles/layout'

export default function MobileNav() {
  return <S.Nav />
}

const S = {
  Nav: styled.nav`
    position: fixed;
    bottom: 0;
    left: 0;
    display: block;
    width: 100vw;
    height: ${layout.mobile.navbarHeight};
    background: gray;
    z-index: 6000;

    @media ${desktop} {
      display: none;
    }
  `,
}
