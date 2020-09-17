import React from 'react'
import { Table } from 'components'
import { gql } from 'gql'
import api from 'api'

const buildQuery = (fields: string[]) => `
  query ToolsUserList($limit: Int, $offset: Int, $sortBy: String, $order: SortOrder, $search: String) {
    userList(limit: $limit, offset: $offset, sortBy: $sortBy, order: $order, search: $search) {
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

const query = (
  fields: string[],
  rows: number,
  offset: number,
  sortBy: string,
  sortDir: 'ASC' | 'DESC',
  search: string
) =>
  api
    .query({
      query: gql(buildQuery(fields)),
      variables: { limit: rows, offset, sortBy, order: sortDir, search },
    })
    .then(({ data: { userList: { edges, total } } }) => ({
      rows: edges.map(({ node: { joined, ...user } }) => ({
        joined: new Date(joined).toLocaleDateString(),
        ...user,
      })),
      total,
    }))

const columns = ['id', 'name', 'email', 'role', 'joined']
const defaultColumns = ['name', 'email', 'role', 'joined']
const defaultSortBy = 'name'

export default function Users() {
  return <Table {...{ query, columns, defaultColumns, defaultSortBy }} />
}
