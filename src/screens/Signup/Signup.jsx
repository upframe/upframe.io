import React from 'react'
import { Redirect } from 'react-router-dom'
import { Spinner } from '../../components'
import { queries, useQuery } from '../../gql'
import { useMe } from '../../utils/hooks'
import Step1 from './Step1'

export default function Signup({ match }) {
  const { me } = useMe()

  const { data: { signUpInfo } = {}, loading, error } = useQuery(
    queries.SIGNUP_INFO,
    {
      variables: match.params,
    }
  )

  if (me) return <Redirect to="/settings" />
  if (loading) return <Spinner centered />
  if (error) return <Redirect to="/" />
  return <Step1 info={signUpInfo} />
}
