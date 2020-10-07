import React from 'react'
import styled from 'styled-components'
import { gql, useQuery } from 'gql'
import type { SpacePage, SpacePageVariables } from 'gql/types'
import { Spinner } from 'components'
import { Redirect, useHistory } from 'react-router-dom'
import { path } from 'utils/url'

const SPACE_QUERY = gql`
  query SpacePage($handle: String!) {
    space(handle: $handle) {
      id
      name
      handle
    }
  }
`

export default function Space({ match }) {
  const history = useHistory()
  const { data, loading } = useQuery<SpacePage, SpacePageVariables>(
    SPACE_QUERY,
    {
      variables: { handle: match.params.handle.toLowerCase() },
    }
  )

  if (loading) return <Spinner />
  if (!data?.space) return <Redirect to="/404" />

  const { name, handle } = data.space

  if (match.params.handle !== handle)
    requestAnimationFrame(() => history.replace(`${path(1)}/${handle}`))

  return <S.Space>{name}</S.Space>
}

const S = {
  Space: styled.div``,
}
