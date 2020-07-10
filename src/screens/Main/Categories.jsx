import React from 'react'
import { Spinner } from '../../components'
import styled from 'styled-components'
import Category from './Category'
import { gql, useQuery } from 'gql'

const CATEGORIES = gql`
  query Lists {
    lists {
      id
      name
      description
      publicView
      pictureUrl
    }
  }
`

export default function Categories() {
  const Container = styled.div`
    display: flex;
    width: auto;
    height: auto;
    overflow-y: auto;
  `
  const { data } = useQuery(CATEGORIES)
  if (data) {
    const lists = data.lists
    const listNames = []
    const photoUrl = []
    lists.forEach(list => listNames.push(list.name))
    lists.forEach(list => photoUrl.push(list.pictureUrl))

    return (
      <Container>
        {listNames.map((v, index) => (
          <Category key={v} name={v} pictureUrl={photoUrl[index]} />
        ))}
      </Container>
    )
  } else {
    return (
      <>
        <Spinner />
      </>
    )
  }
}
