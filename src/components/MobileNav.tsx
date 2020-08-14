import React from 'react'
import styled from 'styled-components'
import { desktop } from 'styles/responsive'
import layout from 'styles/layout'
import { Icon, Link, Button, MsgIcon } from 'components'
import { path } from 'utils/url'
import { useLocation } from 'react-router'
import { useVirtualKeyboard, useLoggedIn } from 'utils/hooks'

export default function MobileNav() {
  useLocation()
  const keyboardOpen = useVirtualKeyboard()
  const loggedIn = useLoggedIn()

  if (keyboardOpen) return null
  return (
    <S.Nav>
      {loggedIn ? (
        <>
          <Link to="/" data-active={path(1) === '/'}>
            <Icon icon="home" />
          </Link>
          <MsgIcon data-active={path(1) === '/conversations'} />
          <Link to="/settings" data-active={path(1) === '/settings'}>
            <Icon icon="person" />
          </Link>
          <Link to="/search" data-active={path(1) === '/search'}>
            <Icon icon="search" />
          </Link>
        </>
      ) : (
        <>
          <Button
            filled
            linkTo="https://www.producthunt.com/upcoming/upframe"
            newTab
          >
            Get Invite
          </Button>
          <Button accent linkTo="/login">
            Log in
          </Button>
        </>
      )}
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
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);

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

    a {
      line-height: 0;
    }

    @media ${desktop} {
      display: none;
    }
  `,
}
