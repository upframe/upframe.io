import React, { useState } from 'react'
import styled from 'styled-components'
import * as styles from './styles'
import Actions from './ActionGroup'
import type { Column } from './filter'

interface Props {
  column: Column
  value: string | number
  editable: boolean
}

export default function ContentCell({ column, value, editable }: Props) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  return (
    <S.Cell>
      <S.Content
        data-column={column.name}
        data-mode={editing ? 'edit' : 'view'}
      >
        {!editing ? (
          <S.ContentSection>
            <span>{value}</span>
          </S.ContentSection>
        ) : column.type === 'string' ? (
          <S.TextInput
            value={editValue}
            onChange={({ target }) => setEditValue(target.value)}
          />
        ) : (
          <S.EnumInput
            value={editValue}
            onChange={({ target }) => setEditValue(target.value)}
          >
            {(column.values ?? []).map(v => (
              <option key={`${column.name}-opt-${v}`}>{v}</option>
            ))}
          </S.EnumInput>
        )}
        {editable && (
          <Actions
            {...(editing
              ? {
                  confirm: ((editValue as any).trim?.() ?? editValue) !== value,
                  cancel: true,
                  onAction(action) {
                    if (action === 'cancel') {
                      setEditing(false)
                      setEditValue(value)
                    }
                  },
                }
              : {
                  edit: true,
                  onAction(action) {
                    if (action === 'edit') setEditing(true)
                  },
                })}
          />
        )}
      </S.Content>
    </S.Cell>
  )
}

const S = {
  Cell: styled(styles.Cell)`
    position: relative;
    overflow: hidden;
  `,

  Content: styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;

    div[data-actions] {
      margin-left: auto;
      flex-shrink: 0;
    }

    svg {
      transform: scale(0.7);
    }

    svg[data-icon='edit'] {
      transition: transform 0.1s ease, fill 0.1s ease;
      transform: scale(0.5);
      fill: var(--border-color);
    }

    &:hover svg[data-icon='edit'],
    &[data-mode='edit'] svg[data-icon='edit'] {
      opacity: 1;
      transform: scale(0.8);
      fill: var(--cl-action-light);
    }

    &[data-column='role'] {
      text-transform: lowercase;
    }
  `,

  ContentSection: styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    flex-grow: 1;
    overflow: hidden;
    position: relative;

    span {
      white-space: nowrap;
      overflow: hidden;
    }

    &::after {
      content: '';
      width: var(--cell-padding);
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      background: linear-gradient(
        to right,
        var(--row-transparent),
        var(--row-color)
      );
    }
  `,

  TextInput: styled.input`
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    padding: 0.2em 0.5em;
    display: block;
    flex-grow: 1;
    margin-right: 1em;
    border: 2px solid var(--cl-action-dark);

    &:focus {
      outline: none;
      border-color: var(--cl-action-light);
    }
  `,

  EnumInput: styled.select``,
}
