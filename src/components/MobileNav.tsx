import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { desktop } from 'styles/responsive'
import layout from 'styles/layout'
import { Icon, Link, Button, MsgIcon } from 'components'
import { path } from 'utils/url'
import { useLocation } from 'react-router'
import { useVirtualKeyboard, useLoggedIn, useMe } from 'utils/hooks'
import { useNavActions, useNavbar } from 'utils/navigation'
import { useSpring, animated } from 'react-spring'

export default function MobileNav() {
  useLocation()
  const keyboardOpen = useVirtualKeyboard()
  const loggedIn = useLoggedIn()
  const { me } = useMe()
  const { action } = useNavActions(<></>)
  const [cached, setCached] = useState<JSX.Element>()
  const { visible } = useNavbar()

  useEffect(() => {
    if (!action) return
    setCached(action)
  }, [action])

  const props = useSpring({
    transform: `translateY(${action ? 0 : -100}%)`,
  })

  if (keyboardOpen || !visible) return null
  return (
    <S.Nav>
      <S.Container style={props}>{cached}</S.Container>
      <S.Container style={props}>
        {loggedIn ? (
          <>
            <Link to="/" data-active={path(1) === '/'}>
              <Icon icon="home" />
            </Link>
            <MsgIcon data-active={path(1) === '/conversations'} />
            <Link
              to={`/${me?.handle}`}
              data-active={path(1) === `/${me?.handle}`}
            >
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
      </S.Container>
    </S.Nav>
  )
}

const S = {
  Nav: styled.nav`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: ${layout.mobile.navbarHeight};
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    z-index: 6000;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @media ${desktop} {
      display: none;
    }
  `,

  Container: styled(animated.div)`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: ${layout.mobile.navbarHeight};
    flex-shrink: 0;

    svg {
      height: calc(${layout.mobile.navbarHeight} * 0.4);
      width: calc(${layout.mobile.navbarHeight} * 0.4);
      fill: var(--cl-text-strong);
    }

    *[data-active='true'] > svg {
      fill: var(--cl-accent);
    }

    a {
      line-height: 0;
    }
  `,
}
