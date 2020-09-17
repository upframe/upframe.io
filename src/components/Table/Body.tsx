import React from 'react'
import * as S from './styles'

type Row = { [c: string]: any }

interface Props {
  columns: string[]
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
          {columns.map(column => (
            <S.ContentCell key={`${row.id}-${column}`}>
              <S.Item key={`${row.id}-${column}`} data-column={column}>
                {row[column]}
              </S.Item>
            </S.ContentCell>
          ))}
        </S.Row>
      ))}
    </>
  )
}
