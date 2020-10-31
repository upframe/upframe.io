import React from 'react'
import { Page, Spinner, Title, Link, Button } from 'components'
import { Redirect, useHistory } from 'react-router-dom'
import { notify } from 'notification'
import { useQuery, useMutation } from 'gql'
import type { SpaceInviteInfo, AcceptSpaceInvite } from 'gql/types'
import { useLoggedIn } from 'utils/hooks'
import { INVITE_QUERY, JOIN_SPACE } from './gql'

export default function Join({ match }) {
  useLoggedIn({ redirect: true })
  const history = useHistory()

  const { data: { spaceInvite: space } = {}, loading } = useQuery<
    SpaceInviteInfo
  >(INVITE_QUERY, {
    variables: { token: match.params.token },
    onCompleted({ spaceInvite }) {
      if (!spaceInvite) notify('invalid invite')
    },
  })

  const [join] = useMutation<AcceptSpaceInvite>(JOIN_SPACE, {
    variables: { token: match.params.token },
    onCompleted({ joinSpace }) {
      history.push(`/s/${joinSpace.handle}`)
    },
  })

  if (loading) return <Spinner centered />
  if (!space) return <Redirect to="/" />
  if (space.isMember) return <Redirect to={`/s/${space.handle}`} />
  return (
    <Page title={`Join ${space.name}`} wrap>
      <Title size={3}>
        You have been invited to join the{' '}
        <Link to={`/s/${space.handle}`}>"{space.name}" space</Link>.
      </Title>
      <Button accent onClick={() => join()}>
        Accept Invitation
      </Button>
    </Page>
  )
}
