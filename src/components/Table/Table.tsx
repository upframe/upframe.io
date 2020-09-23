import React, { useState, useEffect } from 'react'
import { useStateEffect } from 'utils/hooks'
import PaginationInterface from './Pagination'
import type { Filter, Columns } from './filter'
import Filters from './Filters'
import * as S from './styles'
import ColumnSelect from './ColumnSelect'
import Search from './Search'
import FullscreenToggle from './FullscreenToggle'
import Loading from './Loading'
import Header from './Header'
import Body from './Body'

type Row = { [c: string]: any }

export interface TableProps {
  columns: Columns
  defaultColumns: string[]
  query(
    fields: string[],
    rows: number,
    offset: number,
    sortBy: string,
    sortDir: SortDir,
    search?: string,
    filter?: string
  ): Promise<{ rows: Row[]; total: number }>
  width?: string
  numRows?: number
  defaultSortBy: string
  onCellEdit?(
    cells: {
      row: string
      column: string
      value: string | number
    }[]
  ): void
  waitForContent?: boolean
  actions?: string[]
  onAction?(action: string, ...rows: string[]): void
}

export default function Table({
  columns,
  defaultColumns,
  numRows = 25,
  width = '80vw',
  query,
  defaultSortBy,
  onCellEdit,
  waitForContent = false,
  actions = [],
  onAction,
}: TableProps) {
  const [selectedColumns, setSelectedColumns] = useState(defaultColumns)
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string[]>([])
  const [total, setTotal] = useState<number>()
  const [rowLimit, setRowLimit] = useState(numRows)
  const [offset, setOffset] = useState(0)
  const [expandedColumn, setExpandedColumn] = useState<number>()
  const [fullscreen, setFullscreen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [columnNames] = useState(Object.keys(columns))
  const [filters, setFilters] = useState<Filter[]>([])
  const [sortBy, setSortBy] = useStateEffect(setOffset, defaultSortBy)
  const [sortDir, setSortDir] = useStateEffect<'ASC' | 'DESC'>(setOffset, 'ASC')
  const [search, setSearch] = useStateEffect<string>(setOffset)
  const [filter, setFilter] = useStateEffect<string>(setOffset)

  useEffect(() => {
    setLoading(true)
    query(
      selectedColumns,
      rowLimit,
      offset,
      sortBy,
      sortDir,
      search,
      filter
    ).then(({ rows, total }) => {
      setLoading(false)
      setRows(rows)
      setTotal(total)
    })
  }, [
    query,
    selectedColumns,
    rowLimit,
    offset,
    sortBy,
    sortDir,
    search,
    filter,
  ])

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

  function updateFilter(filters: Filter[]) {
    const expr = filters
      .map(
        ({ column, field, action, value, fieldType: type }) =>
          `${column}${!field ? '' : `.${field}`} ${action} ${
            type === 'string' ? `'${value}'` : value
          }`
      )
      .join(' and ')

    if (search) setSearch('')
    setFilter(expr)
  }

  const Pagination = (
    <PaginationInterface
      totalRows={total}
      {...{ rowLimit, setRowLimit, offset, setOffset }}
    />
  )

  return (
    <S.Wrap
      width={width}
      rows={numRows}
      data-view={fullscreen ? 'fullscreen' : 'default'}
    >
      <S.ControlStrip data-menu={selected.length > 0 ? 'actions' : 'default'}>
        <FullscreenToggle {...{ fullscreen, setFullscreen }} />
        {selected.length === 0 ? (
          <>
            <ColumnSelect
              columns={columnNames}
              selected={selectedColumns}
              onSelect={setSelectedColumns}
            />
            <Filters {...{ filters, setFilters, columns, updateFilter }} />
            <Search
              value={searchInput}
              onChange={setSearchInput}
              onSearch={term => {
                if (term === search) return
                setLoading(true)
                setSearch(term)
              }}
              filter={filter}
            />
            {Pagination}
          </>
        ) : (
          <S.BatchActions>
            <span>
              {selected.length} Item{selected.length === 1 ? '' : 's'} Selected
            </span>
            {actions.map(action => (
              <S.ActionButton
                key={`ba-${action}`}
                onClick={() => onAction?.(action, ...selected)}
              >
                {action}
              </S.ActionButton>
            ))}
          </S.BatchActions>
        )}
      </S.ControlStrip>
      <S.Table
        columns={selectedColumns.length + 1}
        expanded={expandedColumn}
        data-expanded={expandedColumn}
        onMouseMove={mouseMove}
        onMouseLeave={() => setExpandedColumn(undefined)}
      >
        <Header
          {...{
            sortBy,
            sortDir,
            toggleAll,
            setSortBy,
            setSortDir,
            setOffset,
          }}
          columns={selectedColumns}
          allSelected={rows.every(({ id }) => selected.includes(id))}
        />
        {!loading && !waitForContent && (
          <Body
            {...{ rows, selected, setSelected, onCellEdit }}
            columns={Object.fromEntries(
              Object.entries(columns).filter(([k]) =>
                selectedColumns.includes(k)
              )
            )}
            actions={actions}
            onAction={(action, row) => onAction?.(action, row)}
          />
        )}
      </S.Table>
      {(loading || waitForContent) && <Loading rows={rowLimit} />}
      <S.ControlStrip>{Pagination}</S.ControlStrip>
    </S.Wrap>
  )
}
