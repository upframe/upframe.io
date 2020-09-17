import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import PaginationInterface from './Pagination'
import { Icon } from 'components'

type Row = { [c: string]: any }

interface Props {
  columns: string[]
  defaultColumns: string[]
  query(
    fields: string[],
    rows: number,
    offset: number,
    sortBy: string,
    sortDir: 'ASC' | 'DESC'
  ): Promise<{ rows: Row[]; total: number }>
  width?: string
  numRows?: number
  defaultSortBy: string
}

export default function Table({
  defaultColumns,
  numRows = 25,
  width = '80vw',
  query,
  defaultSortBy,
}: Props) {
  const [selectedColumns, setSelectedColumns] = useState(defaultColumns)
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string[]>([])
  const [total, setTotal] = useState<number>()
  const [rowLimit, setRowLimit] = useState(numRows)
  const [offset, setOffset] = useState(0)
  const [sortBy, setSortBy] = useState(defaultSortBy)
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('ASC')

  useEffect(() => {
    setLoading(true)
    query(selectedColumns, rowLimit, offset, sortBy, sortDir).then(
      ({ rows, total }) => {
        setLoading(false)
        setRows(rows)
        setTotal(total)
      }
    )
  }, [query, selectedColumns, rowLimit, offset, sortBy, sortDir])

  function onSelect(e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: Row) {
    if (!e.shiftKey || !selected.length)
      return setSelected(
        selected.includes(row.id)
          ? selected.filter(id => id !== row.id)
          : [...selected, row.id]
      )
    const ids: string[] = rows.map(({ id }) => id)
    const bounds = [selected.slice(-1)[0], row.id].map(id => ids.indexOf(id))
    if (bounds[1] > bounds[0]) bounds[1] += 1
    setSelected(
      Array.from(
        new Set([
          ...selected,
          ...ids.slice(Math.min(...bounds), Math.max(...bounds)),
        ])
      )
    )
  }

  const Pagination = (
    <PaginationInterface
      totalRows={total}
      rowLimit={rowLimit}
      setRowLimit={setRowLimit}
      offset={offset}
      setOffset={setOffset}
    />
  )
  return (
    <S.Wrap width={width} rows={numRows}>
      <S.ControlStrip>{Pagination}</S.ControlStrip>
      <S.Table columns={selectedColumns.length}>
        <S.HeaderRow>
          {['', ...selectedColumns].map(column => (
            <S.Header
              key={`title-${column}`}
              onClick={() => {
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
                <Icon
                  icon={`arrow_${sortDir === 'ASC' ? 'down' : 'up'}` as any}
                />
              )}
            </S.Header>
          ))}
        </S.HeaderRow>
        {!loading &&
          rows.map(row => (
            <S.Row key={row.id} data-selected={selected.includes(row.id)}>
              <S.Select onClick={e => onSelect(e, row)}>
                <input
                  type="checkbox"
                  checked={selected.includes(row.id)}
                  readOnly
                />
              </S.Select>
              {selectedColumns.map(column => (
                <S.Cell key={`${row.id}-${column}`}>
                  <S.Item key={`${row.id}-${column}`} data-column={column}>
                    {row[column]}
                  </S.Item>
                </S.Cell>
              ))}
            </S.Row>
          ))}
      </S.Table>
      {loading && (
        <S.LoadingPlaceholder rows={numRows}>
          {Array(numRows)
            .fill(0)
            .map((_, i) => (
              <div key={`loading-${i}`} />
            ))}
        </S.LoadingPlaceholder>
      )}
      <S.ControlStrip>{Pagination}</S.ControlStrip>
    </S.Wrap>
  )
}

const Cell = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--row-height);
  background-color: var(--row-color);
  box-sizing: border-box;
  padding: 0.5rem;
  overflow: hidden;
`

const Row = styled.div`
  display: contents;

  --row-color: #fff;

  &:nth-of-type(2n) {
    --row-color: #f8f8f8;
  }

  &[data-selected='true'] {
    --row-color: #cfe8fc;
  }
`

const _Table = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: var(--row-height) ${({ columns }) =>
      'auto '.repeat(columns)};
  box-sizing: border-box;
  grid-gap: var(--border-size);
  background-color: var(--border-color);
`

const S = {
  Wrap: styled.div<{ width: string; rows: number }>`
    --grid-width: ${({ width }) => width};
    --row-height: 2.5rem;
    --border-color: #90a4ae;
    --border-size: 1px;
    --cl-action-light: #1e88e5;
    --cl-action-dark: #0d47a1;

    width: var(--grid-width);
    margin: auto;
    font-size: 0.85rem;
    box-shadow: 0 0 2px 1px #3338;
    border-radius: 0.15rem;
    user-select: none;
  `,

  Table: _Table,

  Row,

  HeaderRow: styled(Row)`
    --row-color: #fff;
  `,

  Select: styled(Cell)`
    input {
      display: block;
    }
  `,

  Header: styled(Cell)`
    font-weight: bold;
    text-transform: capitalize;
    cursor: s-resize;

    &[data-sortdir='DESC'] {
      cursor: n-resize;
    }

    svg {
      margin-left: auto;
      transform: scale(0.9);
      fill: var(--cl-action-dark);
    }
  `,

  Cell,

  Item: styled.span`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-x: hidden;
    user-select: none;

    &[data-column='role'] {
      text-transform: lowercase;
    }
  `,

  LoadingPlaceholder: styled.div<{ rows: number }>`
    & > div {
      display: block;
      width: 100%;
      height: var(--row-height);
      opacity: 0;
      animation: fade 2s linear 0s infinite;

      &:nth-of-type(2n) {
        background-color: #dceffd;
      }

      &:nth-of-type(2n + 1) {
        background-color: #cfe8fc;
      }

      /* stylelint-disable-next-line */
      ${({ rows }) =>
        Array(rows)
          .fill(0)
          .map(
            (_, i) => `
              &:nth-of-type(${i + 1}n) {
                animation-delay: ${(i / (rows * 3)) * 2}s;
              }`
          )
          .join('\n')}
    }

    @keyframes fade {
      0%,
      20% {
        opacity: 0;
      }

      10% {
        opacity: 0.8;
      }
    }
  `,

  ControlStrip: styled.div`
    display: flex;
    height: 3rem;
    width: 100%;
    box-sizing: border-box;
    padding: 0 1rem;

    --border: calc(2 * var(--border-size)) solid var(--border-color);

    border-bottom: var(--border);

    /* stylelint-disable-next-line */
    ${_Table} ~ & {
      border-top: var(--border);
      border-bottom: none;
    }

    ${PaginationInterface.sc} {
      margin-left: auto;
    }
  `,
}
