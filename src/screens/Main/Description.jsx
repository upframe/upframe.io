import React from 'react'
import { Title, Text } from '../../components'
import { useQuery, gql } from 'gql'

const DESCRIPTION = gql`
  query List($name: String!) {
    list(name: $name) {
      id
      description
      pictureUrl
    }
  }
`
const Description = ({ name }) => {
  const { data, loading } = useQuery(DESCRIPTION, { variables: { name } })
  if (loading) return null
  return (
    <>
      <Title s2> {name}</Title>
      <Text s2>{data.list.description}</Text>
    </>
  )
}

export default Description
