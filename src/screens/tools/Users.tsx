import React, { useState } from 'react'
import { Table } from 'components'
import { gql } from 'gql'
import api from 'api'
import type { Columns, TableProps } from 'components/Table'
import { partition } from 'utils/array'
import type { EditUserInfo, EditUserInfoVariables } from 'gql/types'
import Action, { actions } from './UserAction'

const columns: Columns = {
  id: { type: 'string', filterable: false },
  name: { type: 'string', editable: true },
  handle: { type: 'string', editable: true },
  email: { type: 'string', editable: true },
  role: { type: 'enum', editable: true, values: ['USER', 'MENTOR', 'ADMIN'] },
  location: { type: 'string', editable: true },
  headline: { type: 'string', editable: true },
  invitedBy: {
    type: 'object',
    fields: {
      id: { type: 'string' },
      name: { type: 'string' },
      handle: { type: 'string' },
    },
    displayField: 'name',
  },
  lists: {
    type: 'list',
    fields: {
      id: { type: 'string' },
      name: { type: 'string' },
    },
    displayField: 'name',
  },
  tags: {
    type: 'list',
    fields: {
      id: { type: 'number' },
      name: { type: 'string' },
    },
    displayField: 'name',
  },
  joined: { type: 'string', filterable: false },
}
const defaultColumns = ['name', 'email', 'role']
const defaultSortBy = 'name'

const buildQuery = (fields: string[]) => `
  query ToolsUserList($limit: Int, $offset: Int, $sortBy: String, $order: SortOrder, $search: String, $filter: String) {
    userList(limit: $limit, offset: $offset, sortBy: $sortBy, order: $order, search: $search, filter: $filter) {
      total
      edges {
        node {
          id
          ${fields
            .map(v =>
              !['object', 'list'].includes(columns[v].type)
                ? v
                : `${v} {
            ${Object.keys(columns[v].fields ?? {}).join('\n')}
          }`
            )
            .join('\n')}
        }
      }
    }
  }
`

const EDIT_USER_INFO = gql`
  mutation EditUserInfo($id: ID!, $info: EditUserInfoInput!) {
    editUserInfo(userId: $id, info: $info)
  }
`

const SET_USER_ROLE = gql`
  mutation SetUserRole($id: ID!, $role: Role!) {
    setUserRole(userId: $id, role: $role) {
      id
    }
  }
`

const query: TableProps<string[]>['query'] = (
  fields,
  rows,
  offset,
  sortBy,
  sortDir,
  search,
  filter
) =>
  api
    .query({
      query: gql(buildQuery(fields)),
      variables: {
        limit: rows,
        offset,
        sortBy,
        order: sortDir,
        search: search || undefined,
        filter: filter || undefined,
      },
      fetchPolicy: 'network-only',
    })
    .then(({ data: { userList: { edges, total } } }) => ({
      rows: edges.map(({ node: { joined, ...user } }) => ({
        joined: new Date(joined).toLocaleDateString(),
        ...user,
      })),
      total,
    }))

type Action = {
  action: typeof actions[number]
  users: string[]
}

export default function Users() {
  const [{ action, users } = {} as Action, setAction] = useState<
    Action | undefined
  >()
  const [key, setKey] = useState(0)

  const onCellEdit: TableProps<string[]>['onCellEdit'] = async cells => {
    const byUser = partition(cells, 'row')
    const users = byUser.map(cells =>
      cells.reduce((a, { column, value }) => ({ ...a, [column]: value }), {
        id: cells[0].row,
      })
    )

    Promise.all(
      (users as any[]).flatMap(({ id, role, ...info }) => [
        Object.entries(info).length &&
          api.mutate<EditUserInfo, EditUserInfoVariables>({
            mutation: EDIT_USER_INFO,
            variables: { id, info },
          }),
        role &&
          api.mutate({ mutation: SET_USER_ROLE, variables: { id, role } }),
      ]) as Promise<any>[]
    ).then(() => {
      setKey(key + 1)
    })
  }

  return (
    <>
      <Table
        key={key}
        {...{ query, columns, defaultColumns, defaultSortBy, onCellEdit }}
        actions={actions}
        onAction={(action, ...users) => setAction({ action, users })}
      />
      {action && (
        <Action
          {...{ action, users }}
          onCancel={() => setAction(undefined)}
          onDone={() => {
            setAction(undefined)
            setKey(key + 1)
          }}
        />
      )}
    </>
  )
}
