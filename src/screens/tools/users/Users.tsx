import React from 'react'
import { Table } from 'components'
import { gql } from 'gql'
import api from 'api'

const buildQuery = (fields: string[]) => `
  query ToolsUserList($limit: Int, $offset: Int, $sortBy: String, $order: SortOrder) {
    userList(limit: $limit, offset: $offset, sortBy: $sortBy, order: $order) {
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
  sortDir: 'ASC' | 'DESC'
) =>
  api
    .query({
      query: gql(buildQuery(fields)),
      variables: { limit: rows, offset, sortBy, order: sortDir },
    })
    .then(({ data: { userList: { edges, total } } }) => ({
      rows: edges.map(({ node }) => node),
      total,
    }))

const columns = ['id', 'name', 'email', 'role']
const defaultColumns = ['name', 'email', 'role']
const defaultSortBy = 'name'

export default function Users() {
  return <Table {...{ query, columns, defaultColumns, defaultSortBy }} />
}
