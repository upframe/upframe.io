import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Pagination from './Pagination'

type Row = { [c: string]: any }

interface Props {
  columns: string[]
  defaultColumns: string[]
  query(fields: string[], rows: number): Promise<{ rows: Row[] }>
  width?: string
  numRows?: number
}

export default function Table({
  defaultColumns,
  numRows = 25,
  width = '80vw',
  query,
}: Props) {
  const [selectedColumns, setSelectedColumns] = useState(defaultColumns)
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    query(selectedColumns, numRows).then(({ rows }) => {
      setLoading(false)
      setRows(rows)
    })
  }, [query, selectedColumns, numRows])

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

  return (
    <S.Wrap width={width} rows={numRows}>
      <S.ControlStrip>
        <Pagination totalRows={100} />
      </S.ControlStrip>
      <S.Table columns={selectedColumns.length}>
        <S.HeaderRow>
          {['', ...selectedColumns].map(column => (
            <S.Cell key={`title-${column}`}>
              <S.Header>{column}</S.Header>
            </S.Cell>
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
    </S.Wrap>
  )
}

const Cell = styled.div`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
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
    --row-color: #b3e5fc;
  }

  &:nth-of-type(2n)[data-selected='true'] {
    --row-color: #9edefb;
  }
`

const S = {
  Wrap: styled.div<{ width: string; rows: number }>`
    --grid-width: ${({ width }) => width};
    --row-height: 2rem;

    width: var(--grid-width);
    margin: auto;
    font-size: 0.9rem;
  `,

  Table: styled.div<{ columns: number }>`
    display: grid;
    grid-template-columns: auto ${({ columns }) => '1fr '.repeat(columns)};
    box-sizing: border-box;
    grid-gap: 1px;
    padding: 1px;
    background-color: #bbb;
  `,

  Row,

  HeaderRow: styled(Row)`
    --row-color: #fff;
  `,

  Select: styled(Cell)`
    input {
      display: block;
    }
  `,

  Header: styled.span`
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 0.5em;
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
        background-color: #e1e3eb;
      }

      &:nth-of-type(2n + 1) {
        background-color: #ffdfe8;
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
    height: 2rem;
    width: 100%;
    border: 1px solid gray;
    box-sizing: border-box;

    ${Pagination.sc} {
      margin-left: auto;
    }
  `,
}
