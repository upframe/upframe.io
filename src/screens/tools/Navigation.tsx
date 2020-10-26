import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

interface Props {
  active: string
}

export default function Navigation({ active }: Props) {
  return (
    <S.Nav>
      <ul>
        {['users', 'audit', 'redirects'].map(v => (
          <li key={`tools-nav-${v}`} data-active={v === active}>
            <Link to={v}>{v}</Link>
          </li>
        ))}
      </ul>
    </S.Nav>
  )
}

const S = {
  Nav: styled.nav`
    padding-right: 3rem;

    ul {
      display: flex;
      flex-direction: column;
      padding: 0;
      list-style: none;
      margin: 0;

      & > *:first-child {
        margin-top: 0;
      }
    }

    li {
      color: var(--cl-text-light);
      font-size: 1.1rem;
      white-space: nowrap;
      user-select: none;
      text-decoration: none;
      text-transform: capitalize;
      margin: 0.8rem 0;

      &[data-active='true'] {
        font-weight: bold;
        color: var(--cl-text-strong);
      }
    }

    a {
      color: inherit;
      font-weight: inherit;
      font-size: inherit;
    }
  `,
}
