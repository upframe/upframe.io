import React from 'react'
import styled from 'styled-components'
import { gql, useQuery } from 'gql'
import type { Spaces as SpacesQuery } from 'gql/types'

const SPACES_QUERY = gql`
  query Spaces {
    spaces {
      id
      name
      handle
    }
  }
`

export default function Spaces() {
  const { data: { spaces = [] } = {} } = useQuery<SpacesQuery>(SPACES_QUERY)

  return (
    <S.Spaces>
      <S.List>
        {spaces.map(({ id, name }) => (
          <li key={id}>{name}</li>
        ))}
      </S.List>
    </S.Spaces>
  )
}

const S = {
  Spaces: styled.div``,

  List: styled.ul``,
}
