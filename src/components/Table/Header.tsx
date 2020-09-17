import React from 'react'
import styled from 'styled-components'
import * as styles from './styles'
import { Icon } from 'components'

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
  setOffset,
}: Props) {
  return (
    <S.HeaderRow>
      <S.Select clickable onClick={toggleAll}>
        <input type="checkbox" checked={allSelected} readOnly />
      </S.Select>
      {columns.map(column => (
        <S.Header
          key={`title-${column}`}
          onClick={() => {
            setOffset(0)
            if (sortBy === column)
              return setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC')
            setSortDir('ASC')
            setSortBy(column)
          }}
          data-sortdir={
            sortBy !== column || sortDir === 'DESC' ? 'ASC' : 'DESC'
          }
        >
          <span>{column}</span>
          {sortBy === column && (
            <Icon icon={`arrow_${sortDir === 'ASC' ? 'down' : 'up'}` as any} />
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

    &[data-sortdir='ASC'] {
      cursor: s-resize;
    }

    &[data-sortdir='DESC'] {
      cursor: n-resize;
    }

    svg {
      margin-left: auto;
      transform: scale(0.9);
      fill: var(--cl-action-dark);
    }
  `,
}
