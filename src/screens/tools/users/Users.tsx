import React from 'react'
import { Table } from 'components'
import { gql } from 'gql'
import api from 'api'

const buildQuery = (fields: string[]) => `
  query ToolsUserList($limit: Int, $offset: Int) {
    userList(limit: $limit, offset: $offset) {
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

const query = (fields: string[], rows: number, offset: number) =>
  api
    .query({
      query: gql(buildQuery(fields)),
      variables: { limit: rows, offset },
    })
    .then(({ data: { userList: { edges, total } } }) => ({
      rows: edges.map(({ node }) => node),
      total,
    }))

const columns = ['id', 'name', 'email', 'role']
const defaultColumns = ['name', 'email', 'role']

export default function Users() {
  return <Table {...{ query, columns, defaultColumns }} />
}
