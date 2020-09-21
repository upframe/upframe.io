import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Filter, Columns } from './filter'
import { Title, Icon, Button } from 'components'
import Dropdown from './DropdownAction'
import ActionGroup from './ActionGroup'

interface FilterProps {
  filter: Filter
  onConfirm(): void
  onDelete(): void
}

export function FilterItem({ filter, onConfirm, onDelete }: FilterProps) {
  const [column, setColumn] = useState(filter.column)
  const [actions, setActions] = useState<string[]>([])
  const [action, setAction] = useState(filter.action)
  const [valid, setValid] = useState(filter.valid)
  const [value, setValue] = useState(filter.value)

  useEffect(() => filter.onColumnChange(setColumn), [filter])
  useEffect(() => filter.onActionChange(setAction), [filter])
  useEffect(() => filter.onValueChange(setValue), [filter])
  useEffect(() => filter.onValidChange(setValid), [filter])

  useEffect(() => {
    if (!column) return
    setActions(Filter.actions(filter.columns[column]?.type))
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
        disabled={!column}
        value={action ?? 'COMPARISON'}
        onChange={({ target }) => {
          filter.action = target.value
        }}
      >
        <option disabled>COMPARISON</option>
        {actions.map(v => (
          <option key={`${filter.id}-a-${v}`}>{v}</option>
        ))}
      </select>
      {filter.type === 'enum' ? (
        <select
          value={value ?? 'VALUE'}
          onChange={({ target }) => {
            filter.value = target.value
          }}
        >
          <option disabled>VALUE</option>
          {(filter.columns[filter.column as string].values ?? []).map(v => (
            <option key={v}>{v}</option>
          ))}
        </select>
      ) : (
        <input
          placeholder="VALUE"
          disabled={!(column && action)}
          value={value ?? ''}
          onChange={({ target }) => {
            filter.value = target.value
          }}
        ></input>
      )}
      <ActionGroup
        confirm={valid}
        cancel
        onAction={action => {
          if (action === 'cancel') onDelete()
          else if (action === 'confirm') onConfirm()
        }}
      />
    </S.Filter>
  )
}

interface Props {
  filters: Filter[]
  setFilters(v: Filter[]): void
  columns: Columns
  updateFilter(filters: Filter[]): void
}

export function Filters({ filters, setFilters, columns, updateFilter }: Props) {
  const [_filters, _setFilters] = useState<Filter[]>([])

  useEffect(() => {
    if (filters.some(filter => !_filters.includes(filter)))
      _setFilters(Array.from(new Set([..._filters, ...filters])))
  }, [_filters, filters])

  return (
    <S.Wrap>
      <Title size={4}>Filters</Title>
      <S.FilterList>
        {_filters.map(filter => (
          <FilterItem
            key={filter.id}
            filter={filter}
            onDelete={() => {
              _setFilters(_filters.filter(v => v !== filter))
              if (filters.includes(filter)) {
                const newFilters = filters.filter(v => v !== filter)
                setFilters(newFilters)
                updateFilter(newFilters)
              }
            }}
            onConfirm={() => {
              if (filters.includes(filter)) return updateFilter(filters)
              const newFilters = [...filters, filter]
              setFilters(newFilters)
              updateFilter(newFilters)
            }}
          />
        ))}
      </S.FilterList>
      <Button
        text
        onClick={() => _setFilters([..._filters, new Filter(columns)])}
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

    & > *:last-child {
      flex-grow: 1;
    }
  `,
}
