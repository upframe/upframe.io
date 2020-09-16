import React from 'react'
import { Table } from 'components'
import { gql } from 'gql'
import api from 'api'

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

const query = (fields: string[], rows: number) =>
  api
    .query({ query: gql(buildQuery(fields)), variables: { first: rows } })
    .then(({ data }) => ({ rows: data.userList.edges.map(({ node }) => node) }))

const columns = ['id', 'name', 'email', 'role']
const defaultColumns = ['name', 'email', 'role']

export default function Users() {
  return <Table {...{ query, columns, defaultColumns }} />
}
