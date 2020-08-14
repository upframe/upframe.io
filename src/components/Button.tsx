import React from 'react'
import styled from 'styled-components'
import { Link as InternalLink } from 'react-router-dom'
import Spinner from './Spinner'
import { compose } from 'utils/array'

interface Props {
  onClick?(e?: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
  accent?: boolean
  warn?: boolean
  linkTo?: string
  newTab?: boolean
  filled?: boolean
  text?: boolean
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  disabled?: boolean
  hidden?: boolean
}

const Button: React.FC<Props> = ({
  children,
  onClick,
  accent = false,
  warn = false,
  linkTo,
  newTab = typeof linkTo === 'string' && /^https?:\/\//.test(linkTo),
  filled = false,
  text = false,
  type,
  loading = false,
  disabled = loading,
  hidden = false,
}) => {
  const mods = compose([
    [accent, 'accent'],
    [warn, 'warn'],
    [filled, 'filled'],
    [text, 'text'],
    [loading, 'loading'],
  ])

  const Button = (
    <S.Button
      data-mode={mods.join(' ')}
      onClick={onClick}
      type={type}
      disabled={disabled}
      hidden={hidden}
    >
      {loading && <Spinner />}
      {children}
    </S.Button>
  )
  if (!linkTo) return Button
  const Link = /http(s?):\/\//.test(linkTo) ? 'a' : InternalLink
  return (
    <S.LinkWrap
      {...(newTab && { target: '_blank', rel: 'noopener noreferrer' })}
      {...(/http(s?):\/\//.test(linkTo)
        ? { href: linkTo }
        : { as: Link, to: linkTo })}
    >
      {Button}
    </S.LinkWrap>
  )
}

const S = {
  Button: styled.button`
    appearance: none;
    cursor: pointer;
    height: 2.8rem;
    padding: 0 1.5rem;
    margin-right: 1rem;
    background-color: var(--cl-background);
    border: 1px solid var(--cl-text-medium);
    border-radius: var(--border-radius);
    font-weight: bold;
    color: var(--cl-text-medium);
    font-size: 0.8rem;
    transition: background-color 0.2s ease;

    &:disabled {
      cursor: default;
      opacity: 0.5;
    }

    &:focus {
      outline: none;
    }

    &:hover:not([disabled]) {
      background-color: var(--cl-text-medium);
      color: var(--cl-background);
    }

    &[data-mode~='accent'] {
      color: var(--cl-accent);
      border-color: var(--cl-accent);

      &:hover:not([disabled]) {
        background-color: var(--cl-accent);
      }
    }

    &[data-mode~='warn'] {
      color: var(--cl-error);
      border-color: var(--cl-error);

      &:hover:not([disabled]) {
        color: var(--cl-background);
        background-color: var(--cl-error);
      }
    }

    &[data-mode~='filled'] {
      background-color: var(--cl-accent);
      color: var(--cl-background);
      border: none;

      &:hover:not([disabled]) {
        background-color: var(--cl-accent);
        color: var(--cl-background);
      }
    }

    &[data-mode~='text'] {
      background-color: transparent;
      color: var(--cl-accent);
      border: none;

      &:hover:not([disabled]) {
        background-color: transparent;
        color: var(--cl-accent);
        border: none;
      }
    }

    &[data-mode~='loading'] {
      display: flex;
      justify-content: center;
      align-items: center;
      white-space: nowrap;

      & > svg {
        height: 2.8rem;
        width: 2.8rem;
        margin-left: -2rem;
        margin-right: 0.5rem;
      }
    }
  `,

  LinkWrap: styled.a`
    display: contents !important;
  `,
}
export default Object.assign(Button, { sc: S })
