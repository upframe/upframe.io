import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Filter, Columns } from './filter'
import { Title, Icon, Button } from 'components'
import Dropdown from './DropdownAction'

interface FilterProps {
  filter: Filter
}

export function FilterItem({ filter }: FilterProps) {
  const [column, setColumn] = useState(filter.column)
  const [actions, setActions] = useState<string[]>([])
  const [action, setAction] = useState(filter.action)

  useEffect(() => filter.onColumnChange(setColumn), [filter])
  useEffect(() => filter.onActionChange(setAction), [filter])

  useEffect(() => {
    if (!column) return
    setActions(Filter.actions(filter.columns[column]))
  }, [column, filter.columns])

  return (
    <S.Filter>
      <select
        value={column ?? 'COLUMN'}
        onChange={({ target }) => {
          filter.column = target.value
        }}
      >
        <option disabled>COLUMN</option>
        {Object.keys(filter.columns).map(v => (
          <option key={`${filter.id}-c-${v}`}>{v}</option>
        ))}
      </select>
      <select
        value={action ?? 'ACTION'}
        onChange={({ target }) => {
          filter.action = target.value
        }}
      >
        <option disabled>ACTION</option>
        {actions.map(v => (
          <option key={`${filter.id}-a-${v}`}>{v}</option>
        ))}
      </select>
      <input placeholder="VALUE"></input>
    </S.Filter>
  )
}

interface Props {
  filters: Filter[]
  setFilters(v: Filter[]): void
  columns: Columns
}

export function Filters({ filters, setFilters, columns }: Props) {
  return (
    <S.Wrap>
      <Title size={4}>Filters</Title>
      <S.FilterList>
        {filters.map(filter => (
          <FilterItem key={filter.id} filter={filter} />
        ))}
      </S.FilterList>
      <Button
        text
        onClick={() => setFilters([...filters, new Filter(columns)])}
      >
        add filter
      </Button>
    </S.Wrap>
  )
}

export default function FilterAction(props: Props) {
  return (
    <Dropdown dropdown={<Filters {...props} />}>
      <span>Filters</span>
      <Icon icon="adjust" />
    </Dropdown>
  )
}

const S = {
  Wrap: styled.div`
    padding: 1rem;
    min-width: 20rem;

    & > *:first-child {
      margin-top: 0;
    }

    button {
      white-space: nowrap;
      padding: 0;
      margin: 0;
      color: var(--cl-action-light);
    }
  `,

  FilterList: styled.ul`
    padding: 0;
  `,

  Filter: styled.li`
    display: flex;
    margin-bottom: 1rem;

    & > *:not(:first-child) {
      margin-left: 1rem;
    }
  `,
}
