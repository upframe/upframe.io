import React from 'react'
import styled from 'styled-components'
import { Link } from 'components'
import { path } from 'utils/url'
import { useHistory } from 'react-router-dom'

const routes = {
  Mentors: '',
  People: '/people',
  Settings: '/settings',
  'Activity  Log': '/activity',
}

export default function Navigation() {
  useHistory()

  const offset = Object.entries(routes).findIndex(
    ([, v]) => (v || '/') === `/${path().split('/')[3] ?? ''}`
  )

  return (
    <S.Navigation data-active={offset}>
      <ol>
        {Object.entries(routes).map(([name, route]) => (
          <li key={`sp-${route}`}>
            <Link to={path(2) + route}>{name}</Link>
          </li>
        ))}
      </ol>
      <S.Slider />
    </S.Navigation>
  )
}

const Slider = styled.div`
  width: 25%;
  height: 0.5rem;
  background-color: #000;
  position: absolute;
  bottom: 0;
  border-radius: 0.25rem;
  transition: transform 0.15s ease;
`

const S = {
  Navigation: styled.nav`
    position: relative;
    height: 3rem;

    ol {
      width: 100%;
      display: flex;
      padding: 0;
      list-style: none;
      height: 100%;

      li {
        width: 25%;
        box-sizing: border-box;
        height: 100%;
        border-bottom: 1px solid var(--cl-text-medium);
        position: relative;
      }

      a {
        display: block;
        width: 100%;
        line-height: 3rem;
        text-align: center;
        color: var(--cl-text-medium);
        font-weight: 500;
        font-size: 1rem;
      }
    }

    li::after {
      position: absolute;
      width: 1rem;
      height: calc(100% + 1px);
      top: 0;
      display: block;
      background-color: #fff;
    }

    &[data-active='0'] li:first-of-type::after {
      content: '';
      left: 0;
    }

    &[data-active='${Object.keys(routes).length - 1}'] li:last-of-type::after {
      content: '';
      right: 0;
    }

    /* stylelint-disable-next-line */
    ${Array(Object.keys(routes).length)
      .fill(0)
      .map(
        (_, i) => `
      &[data-active='${i}'] {
        & > ${Slider} {
          transform: translateX(${i * 100}%);
        }

        & > ol > li:nth-of-type(${i + 1}) > a {
          color: #000;
        }
      }
    `
      )}
  `,

  Slider,
}
