import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { gql } from 'gql'
import api from 'api'
import { Spinner, Button } from 'components'

const buildQuery = (fields: string[]) => `
  query ToolsUserList($first: Int, $last: Int, $after: ID, $before: ID) {
    userList(first: $first, last: $last, after: $after, before: $before) {
      total
      edges {
        node {
          id
          ${fields.join('\n')}
        }
      }
    }
  }
`

const fieldSet = ['id', 'name', 'role'] as const

export default function UserList() {
  const [users, setUsers] = useState([])
  const [fieldSelection] = useState<typeof fieldSet[number][]>(['name', 'role'])
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState<number>()
  const [limit, setLimit] = useState(25)
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [pageDir, setPageDir] = useState<'forward' | 'backward'>('forward')

  useEffect(() => {
    setLoading(true)
    api
      .query({
        query: gql(buildQuery(fieldSelection)),
        variables:
          pageDir === 'forward'
            ? { first: limit, after: cursor }
            : { last: limit, before: cursor },
      })
      .then(({ data }) => {
        const { edges, total } = data.userList
        setUsers(edges.map(({ node }) => node))
        setTotal(total)
        setLoading(false)
      })
  }, [fieldSelection, limit, cursor, pageDir])

  function onSelect(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    user: any
  ) {
    if (!e.shiftKey || !selected.length)
      return setSelected(
        selected.includes(user.id)
          ? selected.filter(id => id !== user.id)
          : [...selected, user.id]
      )
    const ids: string[] = users.map(({ id }) => id)
    const bounds = [selected.slice(-1)[0], user.id].map(id => ids.indexOf(id))
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

  function nextPage() {
    const last: any = users.slice(-1)[0]
    if (!last) return
    setPageDir('forward')
    setCursor(last.id)
  }

  function previousPage() {
    const first: any = users[0]
    if (!first) return
    setPageDir('backward')
    setCursor(first.id)
  }

  return (
    <S.Wrap>
      <S.List fields={fieldSelection.length}>
        {['', ...fieldSelection].map(field => (
          <S.Header key={`title-${field}`}>{field}</S.Header>
        ))}
        {loading ? (
          <S.LoadingPlaceholder rows={limit}>
            <Spinner />
          </S.LoadingPlaceholder>
        ) : (
          <>
            {users.flatMap((user: any) => [
              <S.Select
                key={`${user.id}-selected`}
                onClick={e => onSelect(e, user)}
                data-selected={selected.includes(user.id)}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(user.id)}
                  readOnly
                />
              </S.Select>,
              ...Object.entries(user)
                .filter(([k]) => fieldSelection.includes(k as any))
                .sort(
                  ([k1], [k2]) =>
                    fieldSelection.indexOf(k1 as any) -
                    fieldSelection.indexOf(k2 as any)
                )
                .map(([k, v]: [string, any]) => (
                  <S.Item key={`${user.id}-${k}`} data-field={k}>
                    {v}
                  </S.Item>
                )),
            ])}
          </>
        )}
      </S.List>
      <S.PageControl>
        <S.PageSelect>
          <Button text onClick={previousPage}>
            &lt;
          </Button>
          <span>viewing users 1&ndash;{limit}</span>
          <Button text onClick={nextPage}>
            &gt;
          </Button>
        </S.PageSelect>
        <span>total: {total}</span>
        <span>page 1&thinsp;/&thinsp;{Math.ceil((total ?? 0) / limit)}</span>
        <span>
          <select
            value={limit}
            onChange={({ target }) => setLimit(parseInt(target.value))}
          >
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>75</option>
            {Array(19)
              .fill(0)
              .map((_, i) => (i + 2) * 50)
              .map(v => (
                <option key={`opt-${v}`}>{v}</option>
              ))}
          </select>{' '}
          users per page
        </span>
      </S.PageControl>
    </S.Wrap>
  )
}

const S = {
  Wrap: styled.div`
    --grid-width: 60vw;

    width: var(--grid-width);
    margin: auto;
    font-size: 0.85rem;
    user-select: none;
  `,

  List: styled.div<{ fields: number }>`
    display: grid;
    grid-template-columns: auto ${({ fields }) => '1fr '.repeat(fields)};

    --line-height: 2em;

    & > * {
      place-self: center start;
    }
  `,

  Select: styled.div`
    margin-right: 1rem;
    position: relative;
    height: var(--line-height);
    display: flex;
    align-items: center;
    cursor: pointer;

    input {
      display: block;
    }

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: var(--grid-width);
      height: 100%;
    }

    &::before {
      background-color: #fff;
      z-index: -1;
    }

    &:nth-of-type(2n)::before {
      background-color: #00000008;
    }

    &[data-selected='true']::before {
      background-color: #90caf988;
    }

    &:nth-of-type(2n)[data-selected='true']::before {
      background-color: #64b5f688;
    }
  `,

  Header: styled.span`
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 0.5em;
  `,

  Item: styled.span`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-x: hidden;
    user-select: none;

    &[data-field='role'] {
      text-transform: lowercase;
    }
  `,

  LoadingPlaceholder: styled.div<{ rows: number }>`
    display: block;
    width: 100%;
    height: calc(${({ rows }) => rows} * var(--line-height));
  `,

  PageControl: styled.div`
    width: 100%;
    height: 2rem;
    margin-top: 1rem;
    display: flex;
    align-items: center;

    & > * {
      margin: 0 1rem;
    }
  `,

  PageSelect: styled.div`
    display: flex;
    align-items: center;
    height: 100%;

    button {
      margin: 0;
      padding: 0;
      display: block;
      font-size: 1.5em;
    }

    span {
      margin: 0 0.5rem;
    }
  `,
}
