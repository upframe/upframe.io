import React from 'react'
import { Page, Spinner, Title, Link, Button } from 'components'
import { Redirect } from 'react-router-dom'
import { notify } from 'notification'
import { gql, useQuery } from 'gql'
import type { SpaceInviteInfo, SpaceInviteInfoVariables } from 'gql/types'

const INVITE_QUERY = gql`
  query SpaceInviteInfo($token: ID!) {
    spaceInvite(token: $token) {
      name
      handle
      isMember
    }
  }
`

export default function Join({ match }) {
  const { data: { spaceInvite: space } = {}, loading } = useQuery<
    SpaceInviteInfo,
    SpaceInviteInfoVariables
  >(INVITE_QUERY, {
    variables: { token: match.params.token },
    onCompleted({ spaceInvite }) {
      if (!spaceInvite) notify('invalid invite')
    },
  })

  if (loading) return <Spinner centered />
  if (!space) return <Redirect to="/" />
  return (
    <Page title={`Join ${space.name}`} wrap>
      <Title size={3}>
        You have been invited to join the{' '}
        <Link to={`/s/${space.handle}`}>"{space.name}" space</Link>.
      </Title>
      <Button accent>Accept Invitation</Button>
    </Page>
  )
}
