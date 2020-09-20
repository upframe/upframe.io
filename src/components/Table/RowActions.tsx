import React, { useState } from 'react'
import styled from 'styled-components'
import { Cell } from './styles'
import { Icon } from 'components'
import { useClickOutHide } from 'utils/hooks'

interface Props {
  actions: string[]
  onAction(v: string): void
  id: string
  cta?: string[]
}

export default function RowActions({ actions, onAction, id, cta = [] }: Props) {
  const [showDropdown, setShowDropdown] = useState(false)
  const className = `${id}-actions`
  useClickOutHide(className, () => setShowDropdown(false))

  const content = actions.map(action => (
    <S.Action
      key={action}
      onClick={() => onAction(action)}
      data-role={cta.includes(action) ? 'cta' : 'default'}
    >
      {action}
    </S.Action>
  ))

  return (
    <S.Actions
      {...(actions.length >= 3 && {
        onClick() {
          setShowDropdown(!showDropdown)
        },
        className,
      })}
    >
      {actions.length < 3 ? (
        content
      ) : (
        <>
          <Icon icon="more" clickStyle={false} />
          {showDropdown && (
            <S.Dropdown onClick={e => e.stopPropagation()}>
              {content}
            </S.Dropdown>
          )}
        </>
      )}
    </S.Actions>
  )
}

const S = {
  Actions: styled(Cell)`
    display: flex;
    width: 100%;
    height: 100%;
    padding: 0;
    overflow: visible;
    cursor: pointer;

    & > svg {
      margin: auto;
      fill: var(--cl-action-dark);
      transform: scale(0.9);
    }
  `,

  Action: styled.button`
    appearance: none;
    display: block;
    height: 100%;
    flex-grow: 1;
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-family: inherit;
    font-size: 1em;
    color: inherit;

    &[data-role='cta'] {
      color: var(--cl-action-light);
      font-weight: bold;
    }

    &:not(:last-of-type) {
      border-right: 1px solid var(--border-color);
      line-height: 100%;
    }

    &:focus {
      outline: none;
    }
  `,

  Dropdown: styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    right: 50%;
    top: 70%;
    box-shadow: 0 0 2px 1px #0005;
    background-color: #fff;
    z-index: 1000;
    padding: 0.5em 1em;
    min-width: 10rem;

    & > * {
      flex-grow: 0;
      height: 2rem;
      margin: 0;
    }

    & > *:not(:last-of-type) {
      border-right: none;
    }
  `,
}
