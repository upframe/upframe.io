import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { gql } from 'gql'
import api from 'api'

const buildQuery = (fields: string[]) => `
  query ToolsUserList {
    userList {
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

  useEffect(() => {
    api.query({ query: gql(buildQuery(fieldSelection)) }).then(({ data }) => {
      setUsers(data.userList.edges.map(({ node }) => node))
    })
  }, [fieldSelection])

  return (
    <S.List fields={fieldSelection.length}>
      {['', ...fieldSelection].map(field => (
        <S.Header key={`title-${field}`}>{field}</S.Header>
      ))}
      {users.flatMap((user: any) => [
        <S.Select
          key={`${user.id}-selected`}
          onClick={({ target }) =>
            (target as HTMLDivElement).querySelector('input')?.click()
          }
        >
          <input type="checkbox" />
        </S.Select>,
        ...Object.entries(user)
          .filter(([k]) => fieldSelection.includes(k as any))
          .sort(
            ([k1], [k2]) =>
              fieldSelection.indexOf(k1 as any) -
              fieldSelection.indexOf(k2 as any)
          )
          .map(([k, v]: [string, any]) => (
            <S.Item key={`${user.id}-${k}`}>{v}</S.Item>
          )),
      ])}
    </S.List>
  )
}

const S = {
  List: styled.div<{ fields: number }>`
    display: grid;
    grid-template-columns: auto ${({ fields }) => '1fr '.repeat(fields)};
    border: 1px solid gray;
    min-width: 0;
    font-size: 0.85rem;

    --line-height: 2em;
    --grid-width: 60vw;

    width: var(--grid-width);
    margin: auto;

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
  `,
}
