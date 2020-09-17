import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import PaginationInterface from './Pagination'
import { Icon, Title } from 'components'

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

const Cell = styled.div<{ clickable?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--row-height);
  background-color: var(--row-color);
  box-sizing: border-box;
  padding: 0 var(--cell-padding);
  overflow: hidden;
  /* stylelint-disable-next-line */
  ${({ clickable }) => (clickable ? `cursor: pointer;` : '')}
`

const Row = styled.div`
  display: contents;

  --row-color: #fff;
  --row-transparent: #fff0;

  &:nth-of-type(2n) {
    --row-color: #f8f8f8;
    --row-transparent: #f8f8f800;
  }

  &[data-selected='true'] {
    --row-color: #cfe8fc;
    --row-transparent: #cfe8fc00;
  }
`

const _Table = styled.div<{ columns: number; expanded?: number }>`
  display: grid;
  box-sizing: border-box;
  grid-gap: var(--border-size);
  background-color: var(--border-color);
  grid-template-columns: var(--row-height) ${({ columns }) =>
      'auto '.repeat(columns)};

  /* stylelint-disable-next-line */
  ${({ columns }) =>
    Array(columns)
      .fill(0)
      .map(
        (_, i) => `
        &[data-expanded='${i}'] {
          grid-template-columns: var(--row-height) ${'auto '.repeat(
            i
          )}minmax(max-content, auto) ${'auto '.repeat(columns - i - 1)};
        }
      `
      )
      .join('\n')}
`

const S = {
  Wrap: styled.div<{ width: string; rows: number }>`
    --grid-width: ${({ width }) => width};
    --row-height: 2.8rem;
    --border-color: #90a4ae;
    --border-size: 1px;
    --cl-action-light: #1e88e5;
    --cl-action-dark: #0d47a1;
    --cell-padding: 0.8em;

    width: var(--grid-width);
    margin: auto;
    font-size: 0.85rem;
    box-shadow: 0 0 2px 1px #0005;
    border-radius: 0.15rem;
    user-select: none;
    background-color: #fff;

    input[type='checkbox'] {
      cursor: pointer;
    }

    &[data-view='fullscreen'] {
      --grid-width: 100vw;

      position: absolute;
      left: 0;
      top: 0;
      z-index: 2000;
    }
  `,

  Table: _Table,

  Row,

  HeaderRow: styled(Row)`
    --row-color: #fff;
  `,

  Select: styled(Cell)`
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;

    input {
      display: block;
      margin: 0;
    }
  `,

  Header: styled(Cell)`
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

  Cell,

  ContentCell: styled(Cell)`
    position: relative;
    padding-right: 0;
    overflow: hidden;

    &::after {
      content: '';
      width: var(--cell-padding);
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      background: linear-gradient(
        to right,
        var(--row-transparent),
        var(--row-color)
      );
    }
  `,

  Item: styled.span`
    white-space: nowrap;
    margin-right: var(--cell-padding);

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
    height: 3.5rem;
    width: 100%;
    box-sizing: border-box;
    padding-right: 1rem;

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

  NavItem: styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 1em;
    border-right: var(--border-size) solid var(--border-color);
    flex-shrink: 0;
    cursor: pointer;
    position: relative;
    box-sizing: border-box;
    min-width: calc(var(--row-height) + 1px);

    svg {
      margin-left: auto;
      transform: scale(0.8);
      fill: var(--cl-action-dark);

      * ~ & {
        padding-left: 0.5rem;
      }
    }
  `,

  Dropdown: styled.div`
    display: none;
    position: absolute;
    left: 0;
    top: 100%;
    box-shadow: 0 0 2px 1px #0005;
    background: #fff;
    z-index: 10;

    *[aria-expanded='true'] > & {
      display: block;
    }
  `,

  Customize: styled.div`
    padding: 1rem;

    * {
      white-space: nowrap;
    }

    h4 {
      margin-top: 0;
    }

    ul {
      padding: 0;
      margin: 0;
    }

    li {
      list-style: none;
      display: flex;
      align-items: center;

      input {
        margin: 0;
      }

      label {
        margin-left: 0.5rem;
      }
    }
  `,

  ViewToggle: styled.div`
    display: contents;

    svg {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: scale(1) translateX(-50%) translateY(-50%);
    }
  `,
}
