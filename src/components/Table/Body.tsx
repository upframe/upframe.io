import React from 'react'
import * as S from './styles'
import type { Columns } from './filter'
import Cell from './ContentCell'

type Row = { [c: string]: any }

interface Props {
  columns: Columns
  rows: Row[]
  selected: string[]
  setSelected(v: string[]): void
}

export default function Body({ columns, rows, selected, setSelected }: Props) {
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
    <>
      {rows.map(row => (
        <S.Row key={row.id} data-selected={selected.includes(row.id)}>
          <S.Select onClick={e => onSelect(e, row)} clickable>
            <input
              type="checkbox"
              checked={selected.includes(row.id)}
              readOnly
            />
          </S.Select>
          {Object.entries(columns).map(([column, { editable }]) => (
            <Cell
              key={`${row.id}-${column}`}
              column={column}
              value={row[column]}
              editable={editable ?? false}
            />
          ))}
        </S.Row>
      ))}
    </>
  )
}
