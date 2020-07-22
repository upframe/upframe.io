import React from 'react'
import styled from 'styled-components'
import { desktop } from 'styles/responsive'
import layout from 'styles/layout'
import { Icon, Link } from 'components'
import { path } from 'utils/url'
import { useLocation } from 'react-router'

export default function MobileNav() {
  useLocation()

  return (
    <S.Nav>
      <Link to="/" data-active={path(1) === '/'}>
        <Icon icon="home" />
      </Link>
      <Link to="/conversations" data-active={path(1) === '/conversations'}>
        <Icon icon="message" />
      </Link>
      <Link to="/settings" data-active={path(1) === '/settings'}>
        <Icon icon="person" />
      </Link>
      <Link to="/search" data-active={path(1) === '/search'}>
        <Icon icon="search" />
      </Link>
    </S.Nav>
  )
}

const S = {
  Nav: styled.nav`
    position: fixed;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    z-index: 6000;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: ${layout.mobile.navbarHeight};
    background-color: #fff;
    box-shadow: 0 -2px 4px #aaa;

    svg {
      height: calc(${layout.mobile.navbarHeight} * 0.5);
      width: calc(${layout.mobile.navbarHeight} * 0.5);
      fill: #333;
    }

    & > *:last-of-type {
      transform: scale(0.7);
    }

    *[data-active='true'] > svg {
      fill: #ff6d95;
    }

    @media ${desktop} {
      display: none;
    }
  `,
}
