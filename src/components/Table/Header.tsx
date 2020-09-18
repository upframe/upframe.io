import React, { useState } from 'react'
import styled from 'styled-components'
import * as styles from './styles'
import { Icon } from 'components'
import Context from './ColumnContext'

interface Props {
  sortBy: string
  sortDir: SortDir
  allSelected: boolean
  columns: string[]
  setSortBy(column: string): void
  setSortDir(dir: SortDir): void
  toggleAll(): void
  setOffset(n: number): void
}

export default function Header({
  sortBy,
  sortDir,
  allSelected,
  columns,
  setSortBy,
  setSortDir,
  toggleAll,
}: Props) {
  const [context, setContext] = useState<string>()

  return (
    <S.HeaderRow>
      <S.Select clickable onClick={toggleAll}>
        <input type="checkbox" checked={allSelected} readOnly />
      </S.Select>
      {columns.map(column => (
        <S.Header data-context={column === context} key={`title-${column}`}>
          <span>{column}</span>
          {sortBy === column && (
            <Icon icon={`arrow_${sortDir === 'ASC' ? 'down' : 'up'}` as any} />
          )}
          <Icon
            icon="adjust"
            onClick={e => {
              e.stopPropagation()
              setContext(context !== column ? column : undefined)
            }}
            clickStyle={false}
          />
          {context === column && (
            <Context
              column={column}
              sortDir={sortBy === column ? sortDir : undefined}
              setSortDir={dir => {
                setSortBy(column)
                setSortDir(dir)
                setContext(undefined)
              }}
            />
          )}
        </S.Header>
      ))}
    </S.HeaderRow>
  )
}

const S = {
  ...styles,

  HeaderRow: styled(styles.Row)`
    --row-color: #fff;
  `,

  Header: styled(styles.Cell)`
    font-weight: bold;
    text-transform: capitalize;
    overflow: visible;

    svg {
      margin-left: auto;
      transform: scale(0.9);
      fill: var(--cl-action-dark);
    }

    svg[data-icon^='arrow'] {
      position: absolute;
      right: var(--cell-padding);
    }

    svg[data-icon='adjust'] {
      transform: scale(0.8);
      opacity: 0;
      transition: opacity 0.2s ease;
      cursor: pointer;
      z-index: 1000;
    }

    &[data-context='true'] > svg[data-icon='adjust'] {
      opacity: 1;
    }

    svg[data-icon^='arrow'] ~ svg[data-icon='adjust'] {
      transition: none;
    }

    &:hover > svg[data-icon^='arrow'] {
      display: none;
    }

    &:hover > svg[data-icon='adjust'] {
      opacity: 1;
      fill: var(--cl-action-light);
    }
  `,
}
