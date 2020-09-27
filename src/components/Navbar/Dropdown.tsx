import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useMe, useSignOut } from 'utils/hooks'
import { mutations, useMutation } from 'gql'

export default function Dropdown({ onBlur }) {
  const ref = useRef() as React.MutableRefObject<HTMLElement>
  const { me } = useMe()
  const afterSignOut = useSignOut()

  const [signOut] = useMutation(mutations.SIGN_OUT, {
    onCompleted: afterSignOut,
  })

  useEffect(() => {
    if (!ref.current) return
    ref.current.focus()
  }, [ref])

  const onClick = () => {
    window.addEventListener(
      'mouseup',
      () => {
        setTimeout(onBlur, 100)
      },
      { once: true }
    )
  }

  return (
    <S.Dropdown tabIndex={0} ref={ref} onBlur={onClick}>
      <Link to={`/${me ? me.handle : ''}`}>My Profile</Link>
      <Link to={`/settings/public`}>Settings</Link>
      <p onClick={() => signOut()}>Sign out</p>
      {me?.role === 'ADMIN' && <S.Admin to="/tools">Admin tools</S.Admin>}
    </S.Dropdown>
  )
}

const S = {
  Dropdown: styled.nav`
    position: absolute;
    top: 4.8rem;
    right: calc(15vw + 1.3125rem - 5.35rem);
    width: 10.7rem;
    padding: 1rem 0;
    box-sizing: border-box;
    background-color: var(--cl-background);
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.5));
    border-radius: var(--border-radius);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: calc(50% - 0.5rem);
      width: 1rem;
      height: 1rem;
      transform: translateY(-0.5rem) rotateZ(45deg);
      background-color: var(--cl-background);
      transform-origin: center;
      z-index: -1;
    }

    @media (max-width: 1020px) {
      right: 2.5vw;

      &::before {
        left: initial;
        right: calc(-0.5rem + 1.3125rem);
      }
    }

    & > * {
      display: block;
      width: 100%;
      height: 2.5625rem;
      line-height: 2.5625rem;
      font-size: 1rem;
      color: var(--cl-text-medium);
      cursor: pointer;
      text-indent: 1rem;
      text-decoration: none;
      margin: 0;

      &:visited,
      &:hover {
        color: var(--cl-text-medium);
      }

      &:hover {
        background-color: #e0e0e0;
      }
    }

    &:focus {
      outline: none;
    }
  `,

  Admin: styled(Link)`
    background-color: #dceffd;

    &:hover {
      background-color: #0091ea55;
    }
  `,
}
