import React from 'react'
import styled from 'styled-components'
import { Title, Icon } from 'components'
import Dropdown from './DropdownAction'

interface Props {
  columns: string[]
  selected: string[]
  onSelect(selected: string[]): void
}

export function ColumnSelect({ columns, selected, onSelect }: Props) {
  return (
    <S.Select>
      <Title size={4}>Display Columns</Title>
      <ul>
        {columns.map(name => (
          <li key={`cl-${name}`}>
            <input
              type="checkbox"
              id={`cl-${name}`}
              checked={selected.includes(name)}
              onChange={({ target }) => {
                onSelect(
                  target.checked
                    ? columns.filter(
                        column => selected.includes(column) || column === name
                      )
                    : selected.filter(v => v !== name)
                )
              }}
            />
            <label htmlFor={`cl-${name}`}>{name}</label>
          </li>
        ))}
      </ul>
    </S.Select>
  )
}

export default function Action(props: Props) {
  return (
    <Dropdown dropdown={<ColumnSelect {...props} />}>
      <span>Columns</span>
      <Icon icon="gear" />
    </Dropdown>
  )
}

const S = {
  Select: styled.div`
    padding: 1rem;

    * {
      white-space: nowrap;
    }

    h4 {
      margin-top: 0;
    }

    ul {
      padding: 0;
      margin: 0;
    }

    li {
      list-style: none;
      display: flex;
      align-items: center;

      input {
        margin: 0;
      }

      label {
        margin-left: 0.5rem;
      }
    }
  `,
}
