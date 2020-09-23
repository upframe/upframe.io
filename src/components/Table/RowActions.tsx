import React, { useState } from 'react'
import styled from 'styled-components'
import { Cell, ActionButton } from './styles'
import { Icon } from 'components'
import { useClickOutHide } from 'utils/hooks'

interface Props {
  actions: string[]
  onAction(v: string): void
  id: string
  cta?: string[]
  disabled?: boolean
}

export default function RowActions({
  actions,
  onAction,
  id,
  cta = [],
  disabled = false,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false)
  const className = `${id}-actions`
  useClickOutHide(className, () => setShowDropdown(false))

  const content = actions.map(action => (
    <S.Action
      key={action}
      onClick={() => !disabled && onAction(action)}
      data-role={cta.includes(action) ? 'cta' : 'default'}
    >
      {action}
    </S.Action>
  ))

  return (
    <S.Actions
      data-state={disabled ? 'disabled' : 'enabled'}
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

    &[data-state='disabled'] {
      cursor: default;
      pointer-events: none;

      & > svg {
        fill: var(--cl-text-medium);
      }
    }
  `,

  Action: styled(ActionButton)`
    flex-grow: 1;

    &[data-role='cta'] {
      color: var(--cl-action-light);
      font-weight: bold;
    }

    &:not(:last-of-type) {
      border-right: 1px solid var(--border-color);
      line-height: 100%;
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
