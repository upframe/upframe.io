import React from 'react'
import { Redirect } from 'react-router-dom'
import { Spinner } from '../../components'
import { useQuery } from 'gql'
import { useMe } from 'utils/hooks'
import Step1 from './Step1'
import Step2 from './Step2'
import type * as T from 'gql/types'
import * as gql from './gql'

export default function Signup({ match }) {
  const { me } = useMe()

  const { data: { signUpInfo } = {}, loading, error } = useQuery<
    T.SignUpTokenInfo,
    T.SignUpTokenInfoVariables
  >(gql.SIGNUP_INFO, {
    variables: match.params,
    skip: !match.params.token,
  })

  if (me) return <Redirect to="/settings" />
  if (loading) return <Spinner centered />

  const params = new URLSearchParams(window.location.search)
  const state = params.get('state')
  params.delete('state')
  const searchStr = `?${params.toString()}`.replace(/^\?$/, '')

  if (!match.params.token)
    return state ? (
      <Redirect to={`${match.url}/${state}${searchStr}`} />
    ) : (
      <Redirect to="/" />
    )
  if (error) return <Redirect to="/" />
  if (
    signUpInfo?.signUpId &&
    window.location.pathname.split('/').pop() !== signUpInfo.signUpId
  )
    return <Redirect to={`/signup/${signUpInfo.signUpId}`} />
  if (signUpInfo?.authComplete)
    return <Step2 token={match.params.token} info={signUpInfo} />
  return <Step1 info={signUpInfo} token={match.params.token} />
}
