import React from 'react'
import styled from 'styled-components'
import { Link } from 'components'
import { path } from 'utils/url'

export default function Navigation() {
  return (
    <S.Navigation>
      <ol>
        <li>
          <Link to={path(2)}>Mentors</Link>
        </li>
        <li>
          <Link to={path(2) + '/people'}>People</Link>
        </li>
        <li>
          <Link to={path(2) + '/settings'}>Settings</Link>
        </li>
        <li>
          <Link to={path(2) + '/activity'}>Activity Log</Link>
        </li>
      </ol>
    </S.Navigation>
  )
}

const S = {
  Navigation: styled.nav`
    ol {
      width: 100%;
      display: flex;
      box-sizing: border-box;
      padding: 0;
      list-style: none;

      li {
        width: 25%;
        border-bottom: 1px solid #000;
      }
    }
  `,
}
