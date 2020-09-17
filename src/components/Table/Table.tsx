import React, { useState, useEffect } from 'react'
import PaginationInterface from './Pagination'
import Filters from './Filters'
import * as S from './styles'
import ColumnSelect from './ColumnSelect'
import Search from './Search'
import FullscreenToggle from './FullscreenToggle'
import Loading from './Loading'
import Header from './Header'
import Body from './Body'

type Row = { [c: string]: any }

interface Props {
  columns: string[]
  defaultColumns: string[]
  query(
    fields: string[],
    rows: number,
    offset: number,
    sortBy: string,
    sortDir: SortDir,
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
        <FullscreenToggle {...{ fullscreen, setFullscreen }} />
        <ColumnSelect
          columns={columns}
          selected={selectedColumns}
          onSelect={setSelectedColumns}
        />
        <Filters />
        <Search
          value={searchInput}
          onChange={setSearchInput}
          onSearch={term => {
            if (term === search) return
            setLoading(true)
            setSearch(term)
          }}
        />
        {Pagination}
      </S.ControlStrip>
      <S.Table
        columns={selectedColumns.length}
        expanded={expandedColumn}
        data-expanded={expandedColumn}
        onMouseMove={mouseMove}
        onMouseLeave={() => setExpandedColumn(undefined)}
      >
        <Header
          {...{ sortBy, sortDir, toggleAll, setSortBy, setSortDir, setOffset }}
          columns={selectedColumns}
          allSelected={rows.every(({ id }) => selected.includes(id))}
        />
        {!loading && (
          <Body
            {...{ rows, selected, setSelected }}
            columns={selectedColumns}
          />
        )}
      </S.Table>
      {loading && <Loading rows={rowLimit} />}
      <S.ControlStrip>{Pagination}</S.ControlStrip>
    </S.Wrap>
  )
}
