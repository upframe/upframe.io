import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

interface Props {
  tabs: string[] | { [k: string]: string }
  active?: string
  onNavigate?(tab: string): void
}

export default function Navbar({ tabs, active, onNavigate }: Props) {
  return (
    <S.Navbar
      data-active={(Array.isArray(tabs) ? tabs : Object.keys(tabs)).indexOf(
        active as any
      )}
      tabs={Array.isArray(tabs) ? tabs.length : Object.keys(tabs).length}
    >
      <ol>
        {(Array.isArray(tabs) ? tabs.map(v => [v]) : Object.entries(tabs)).map(
          ([k, v]) => (
            <li key={`sp-${k}`} onClick={() => onNavigate?.(k)}>
              {typeof v === 'string' ? (
                <Link to={v}>{k}</Link>
              ) : (
                <span>{k}</span>
              )}
            </li>
          )
        )}
      </ol>
      <S.Slider />
    </S.Navbar>
  )
}

const Slider = styled.div`
  height: 0.5rem;
  background-color: #e9476a;
  position: absolute;
  bottom: 0;
  border-radius: 0.25rem;
  transition: transform 0.15s ease;
`

const S = {
  Navbar: styled.nav<{ tabs: number }>`
    position: relative;
    height: 3rem;
    margin: 2rem 0;
    user-select: none;
    overflow-x: auto;
    box-sizing: content-box;
    background-color: #fff;
    z-index: 500;

    --min-tab-width: 12ch;

    li,
    ${Slider} {
      width: ${({ tabs }) => 100 / tabs}%;
    }

    ${Slider} {
      min-width: var(--min-tab-width);
    }

    ol {
      margin: 0;
      width: 100%;
      min-width: calc(${({ tabs }) => tabs} * var(--min-tab-width));
      display: flex;
      padding: 0;
      list-style: none;
      height: 100%;
      position: relative;

      li {
        box-sizing: border-box;
        height: 100%;
        border-bottom: 1px solid var(--cl-text-medium);
        position: relative;
        cursor: pointer;
        white-space: nowrap;
      }

      a,
      span {
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

    &[data-active='${({ tabs }) => tabs - 1}'] li:last-of-type::after {
      content: '';
      right: 0;
    }

    /* stylelint-disable-next-line */
    ${({ tabs }) =>
      Array(tabs)
        .fill(0)
        .map(
          (_, i) => `
      &[data-active='${i}'] {
        & > ${Slider} {
          transform: translateX(${i * 100}%);
        }

        & > ol > li:nth-of-type(${i + 1}) > a {
          color: #E9476A;
        }
      }
    `
        )}
  `,

  Slider,
}
