import React, { useState } from 'react'
import { Logo, SearchBar, Button, MsgIcon } from 'components'
import UserIcon from './UserIcon'
import Dropdown from './Dropdown'
import { useScrollAtTop, useMe } from 'utils/hooks'
import styled from 'styled-components'
import { mobile } from 'styles/responsive'
import layout from 'styles/layout'

export default function Navbar() {
  const { me } = useMe()
  const [showDropdown, setShowDropdown] = useState(false)
  const atTop = useScrollAtTop()

  if (
    window.location.pathname.toLowerCase().split('/').filter(Boolean)[0] ===
    'signup'
  )
    return null
  return (
    <S.Navbar data-signedin={!!me} data-shadow={!atTop}>
      <Logo home />
      <SearchBar />
      <S.Right>
        {me && (
          <>
            <MsgIcon />
            <UserIcon
              onClick={() => {
                if (!showDropdown) setShowDropdown(true)
              }}
            />
          </>
        )}
        {!me && (
          <>
            <Button text linkTo="/login">
              Sign in
            </Button>
            <Button
              filled
              linkTo="https://www.producthunt.com/upcoming/upframe"
              newTab={true}
            >
              Get Early Access
            </Button>
          </>
        )}
      </S.Right>
      {showDropdown && <Dropdown onBlur={() => setShowDropdown(false)} />}
    </S.Navbar>
  )
}

const S = {
  Navbar: styled.header`
    position: fixed;
    top: 0;
    z-index: 1100;
    box-sizing: border-box;
    width: 100vw;
    height: ${layout.desktop.navbarHeight} !important;
    display: flex;
    align-items: center;
    padding: 0 2.5vw;
    background: var(--cl-background);
    transition: box-shadow 0.25s ease;

    @media (min-width: 1021px) {
      padding: 0 15vw;
    }

    img:first-child {
      margin-left: -0.8rem;
      margin-right: 1rem;

      @media (max-width: 600px) {
        margin-left: -1.3rem;
        margin-right: -0.5rem;
      }
    }

    &[data-shadow='true'] {
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }

    @media ${mobile} {
      display: none;
    }
  `,

  Right: styled.div`
    box-sizing: border-box;
    padding-left: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-left: auto;
    width: 8rem;

    & > *:first-child {
      margin-right: 1rem;
    }

    button:last-of-type {
      margin-right: 0;
      margin-left: 1rem;
    }

    [data-signedin='false'] > & {
      @media (max-width: 750px) {
        display: none;
      }
    }

    button {
      flex-shrink: 0;
    }

    svg {
      opacity: 0.8;
      width: 1.4rem;
      height: 1.4rem;

      path {
        fill: var(--cl-text-strong);
      }
    }
  `,
}
