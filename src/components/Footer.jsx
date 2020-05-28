import React from 'react'
import styled from 'styled-components'
import { Link } from 'components'
import { useMe } from 'utils/hooks'

export default function Footer() {
  const { me } = useMe()

  return (
    <S.Footer data-singedin={!!me}>
      <p>{new Date().getFullYear()} Upframe™</p>
      <Link to="/privacy">Privacy policy</Link>
    </S.Footer>
  )
}

const S = {
  Footer: styled.footer`
    box-sizing: border-box;
    width: 100vw;
    height: 5rem;
    margin-bottom: -5rem;
    margin-top: 3rem;
    background: #fff;
    position: relative;
    z-index: 5000;
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    align-items: center;
    padding: 0 max(5vw, 3rem);
    user-select: none;
    overflow: hidden;

    & > * {
      margin-left: 2rem;

      &:last-child {
        margin-left: 0;
      }
    }

    a,
    p {
      color: var(--cl-text-medium);
      font-size: 0.9rem;
    }

    svg {
      width: 2.5rem;
      height: 2.5rem;
    }

    *:not([data-type='social']) + a[data-type='social'] {
      margin-right: auto;
    }

    &[data-singedin='false'] {
      margin-bottom: -1rem;
    }
  `,
}
