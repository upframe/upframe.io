import React, { useState, useEffect } from 'react'
import { Icon, Title } from 'components'
import PaginationInterface from './Pagination'
import Filters from './Filters'
import * as S from './styles'

type Row = { [c: string]: any }

interface Props {
  columns: string[]
  defaultColumns: string[]
  query(
    fields: string[],
    rows: number,
    offset: number,
    sortBy: string,
    sortDir: 'ASC' | 'DESC',
    search?: string
  ): Promise<{ rows: Row[]; total: number }>
  width?: string
  numRows?: number
  defaultSortBy: string
}

export default function Table({
  columns,
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
  const [expandedColumn, setExpandedColumn] = useState<number>()
  const [fullscreen, setFullscreen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState<string>()

  useEffect(() => {
    setLoading(true)
    query(selectedColumns, rowLimit, offset, sortBy, sortDir, search).then(
      ({ rows, total }) => {
        setLoading(false)
        setRows(rows)
        setTotal(total)
      }
    )
  }, [query, selectedColumns, rowLimit, offset, sortBy, sortDir, search])

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

  function toggleAll() {
    const rowIds = rows.map(({ id }) => id)
    if (rowIds.every(id => selected.includes(id)))
      setSelected(selected.filter(id => !rowIds.includes(id)))
    else setSelected(Array.from(new Set([...selected, ...rowIds])))
  }

  function mouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!e.currentTarget) return
    const clBoxes = Array.from(
      (e.currentTarget as HTMLElement).firstChild?.childNodes ?? []
    )
      .slice(1)
      .map(v => (v as HTMLElement).getBoundingClientRect())

    const column = clBoxes.findIndex(
      ({ left, right }) => e.pageX >= left && e.pageX <= right + 1
    )
    if (column < 0 || expandedColumn === column) return
    setExpandedColumn(column)
  }

  const Pagination = (
    <PaginationInterface
      totalRows={total}
      rowLimit={rowLimit}
      setRowLimit={n => {
        setOffset(0)
        setRowLimit(n)
      }}
      offset={offset}
      setOffset={setOffset}
    />
  )

  return (
    <S.Wrap
      width={width}
      rows={numRows}
      data-view={fullscreen ? 'fullscreen' : 'default'}
    >
      <S.ControlStrip>
        <S.NavItem onClick={() => setFullscreen(!fullscreen)}>
          <S.ViewToggle>
            <Icon icon={fullscreen ? 'minimize' : 'maximize'} />
          </S.ViewToggle>
        </S.NavItem>
        <S.NavItem
          aria-expanded={false}
          onClick={({ currentTarget }) =>
            currentTarget.setAttribute(
              'aria-expanded',
              (
                currentTarget.getAttribute('aria-expanded') === 'false'
              ).toString()
            )
          }
        >
          <span>Columns</span>
          <Icon icon="gear" />
          <S.Dropdown onClick={e => e.stopPropagation()}>
            <S.Customize>
              <Title size={4}>Display Columns</Title>
              <ul>
                {columns.map(name => (
                  <li key={`cl-${name}`}>
                    <input
                      type="checkbox"
                      id={`cl-${name}`}
                      checked={selectedColumns.includes(name)}
                      onChange={({ target }) => {
                        setSelectedColumns(
                          target.checked
                            ? [...selectedColumns, name]
                            : selectedColumns.filter(v => v !== name)
                        )
                      }}
                    />
                    <label htmlFor={`cl-${name}`}>{name}</label>
                  </li>
                ))}
              </ul>
            </S.Customize>
          </S.Dropdown>
        </S.NavItem>
        <S.NavItem>
          <span>Filter</span>
          <Icon icon="adjust" />
          <S.Dropdown>
            <Filters />
          </S.Dropdown>
        </S.NavItem>
        <S.SearchWrap>
          <S.SearchBar
            data-focus={false}
            onMouseDown={({ currentTarget }) =>
              requestAnimationFrame(() =>
                currentTarget.querySelector('input')?.focus()
              )
            }
            onSubmit={e => {
              e.preventDefault()
              if (search === searchInput) return
              setLoading(true)
              setSearch(searchInput || undefined)
            }}
          >
            <Icon icon="search" />
            <S.SearchInput
              placeholder="Search by name"
              onFocus={({ target }) =>
                ((target.parentElement as HTMLFormElement).dataset.focus =
                  'true')
              }
              onBlur={({ target }) =>
                ((target.parentElement as HTMLFormElement).dataset.focus =
                  'false')
              }
              value={searchInput}
              onChange={({ target }) => setSearchInput(target.value)}
            />
          </S.SearchBar>
        </S.SearchWrap>
        {Pagination}
      </S.ControlStrip>
      <S.Table
        columns={selectedColumns.length}
        expanded={expandedColumn}
        data-expanded={expandedColumn}
        onMouseMove={mouseMove}
        onMouseLeave={() => setExpandedColumn(undefined)}
      >
        <S.HeaderRow>
          <S.Select clickable onClick={toggleAll}>
            <input
              type="checkbox"
              checked={rows.every(({ id }) => selected.includes(id))}
              readOnly
            />
          </S.Select>
          {selectedColumns.map(column => (
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
              <S.Select onClick={e => onSelect(e, row)} clickable>
                <input
                  type="checkbox"
                  checked={selected.includes(row.id)}
                  readOnly
                />
              </S.Select>
              {selectedColumns.map(column => (
                <S.ContentCell key={`${row.id}-${column}`}>
                  <S.Item key={`${row.id}-${column}`} data-column={column}>
                    {row[column]}
                  </S.Item>
                </S.ContentCell>
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
