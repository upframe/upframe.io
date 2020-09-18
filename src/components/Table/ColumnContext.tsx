import React from 'react'
import styled from 'styled-components'
import { Title } from 'components'

interface Props {
  column: string
  sortDir?: 'ASC' | 'DESC'
  setSortDir(dir: 'ASC' | 'DESC'): void
}

export default function ColumnContext({ column, sortDir, setSortDir }: Props) {
  return (
    <S.Context>
      <Title size={4}>Sort</Title>
      <S.Sort>
        <S.SortOption>
          <input
            type="radio"
            name={`sort-${column}`}
            id={`sort-${column}-ASC`}
            checked={sortDir === 'ASC'}
            onChange={() => setSortDir('ASC')}
          />
          <label htmlFor={`sort-${column}-ASC`}>Ascending</label>
        </S.SortOption>
        <S.SortOption>
          <input
            type="radio"
            name={`sort-${column}`}
            id={`sort-${column}-DESC`}
            checked={sortDir === 'DESC'}
            onChange={() => setSortDir('DESC')}
          />
          <label htmlFor={`sort-${column}-DESC`}>Descending</label>
        </S.SortOption>
      </S.Sort>
    </S.Context>
  )
}

const S = {
  Context: styled.div`
    position: absolute;
    right: 0;
    top: 100%;
    box-shadow: 0 0 0.5em 1px #0005;
    z-index: 10;
    display: block;
    background-color: #fff;
    padding: 1rem;
    color: var(--cl-text-strong);

    &::before,
    &::after {
      content: '';
      position: absolute;
      display: block;
      right: 0;
      width: var(--row-height);
      background: #fff;
    }

    &::before {
      bottom: 100%;
      height: var(--row-height);
      box-shadow: inherit;
    }

    &::after {
      content: '';
      height: calc(0.5em + 1px);
      width: calc(var(--row-height) + 0.5em + 1px);
      top: 0;
    }

    & > *:first-child {
      margin-top: 0;
      margin-bottom: 1em;
      font-size: 1em;
    }
  `,

  Sort: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  SortOption: styled.div`
    display: flex;
    align-items: center;

    * {
      display: block;
      margin: 0;
      cursor: pointer;
    }

    label {
      margin-left: 0.5rem;
    }

    & + & {
      margin-left: 1rem;
    }
  `,
}
