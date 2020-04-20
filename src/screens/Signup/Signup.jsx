import React from 'react'
import { Redirect } from 'react-router-dom'
import { Spinner } from '../../components'
import { gql, useQuery } from '../../gql'
import { useMe } from '../../utils/hooks'
import Step1 from './Step1'
import Step2 from './Step2'

export const SIGNUP_INFO = gql`
  query SignUpInfo($token: ID!) {
    signUpInfo(token: $token) {
      id
      email
      role
      authComplete
      name
    }
  }
`

export default function Signup({ match }) {
  const { me } = useMe()

  const { data: { signUpInfo } = {}, loading, error } = useQuery(SIGNUP_INFO, {
    variables: match.params,
    skip: !match.params.token,
  })

  const state = new URLSearchParams(window.location.search).get('state')

  if (me) return <Redirect to="/settings" />
  if (loading) return <Spinner centered />
  if (!match.params.token)
    return state ? (
      <Redirect to={`${match.url}/${state}${window.location.search}`} />
    ) : (
      <Redirect to="/" />
    )
  if (error) return <Redirect to="/" />
  if (signUpInfo.authComplete)
    return <Step2 token={match.params.token} name={signUpInfo.name} />
  return <Step1 info={signUpInfo} token={match.params.token} />
}
