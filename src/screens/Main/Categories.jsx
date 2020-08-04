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
      backgroundColor
      textColor
    }
  }
`

export default function Categories() {
  const { data, loading } = useQuery(CATEGORIES)

  if (loading) return <Spinner centered />

  return (
    <Container>
      {data.lists.map(list => (
        <Category
          key={list.id}
          pictureUrl={list.pictureUrl}
          name={list.name}
          backgroundColor={list.backgroundColor}
          textColor={list.textColor}
        />
      ))}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  position: relative;
  overflow-x: scroll;
  overflow-y: hidden;
  margin-left: -14vw;
  margin-right: -25vw;
  justify-content: space-between;
  scroll-snap-type: x proximity;
  scroll-padding: 50%;

  @media (max-width: 1020px) {
    margin: auto;
    scroll-snap-type: x mandatory;
  }
`
