import React from 'react'
import { Table } from 'components'
import { gql } from 'gql'
import api from 'api'
import type { Columns, TableProps } from 'components/Table'
import { partition } from 'utils/array'
import type { EditUserInfo, EditUserInfoVariables } from 'gql/types'

const buildQuery = (fields: string[]) => `
  query ToolsUserList($limit: Int, $offset: Int, $sortBy: String, $order: SortOrder, $search: String, $filter: String) {
    userList(limit: $limit, offset: $offset, sortBy: $sortBy, order: $order, search: $search, filter: $filter) {
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

const EDIT_USER_INFO = gql`
  mutation EditUserInfo($id: ID!, $info: EditUserInfoInput!) {
    editUserInfo(userId: $id, info: $info)
  }
`

const query: TableProps['query'] = (
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
    })
    .then(({ data: { userList: { edges, total } } }) => ({
      rows: edges.map(({ node: { joined, ...user } }) => ({
        joined: new Date(joined).toLocaleDateString(),
        ...user,
      })),
      total,
    }))

const onCellEdit: TableProps['onCellEdit'] = async cells => {
  const byUser = partition(cells, 'row')
  const users = byUser.map(cells =>
    cells.reduce((a, { column, value }) => ({ ...a, [column]: value }), {
      id: cells[0].row,
    })
  )

  await Promise.all(
    users.map(({ id, ...info }) =>
      api.mutate<EditUserInfo, EditUserInfoVariables>({
        mutation: EDIT_USER_INFO,
        variables: { id, info },
      })
    )
  )
}

const columns: Columns = {
  id: { type: 'string' },
  name: { type: 'string', editable: true },
  email: { type: 'string', editable: true },
  role: { type: 'enum', editable: true, values: ['USER', 'MENTOR', 'ADMIN'] },
  location: { type: 'string', editable: true },
  headline: { type: 'string', editable: true },
  joined: { type: 'string' },
}
const defaultColumns = ['name', 'email', 'role']
const defaultSortBy = 'name'

export default function Users() {
  return (
    <Table {...{ query, columns, defaultColumns, defaultSortBy, onCellEdit }} />
  )
}
