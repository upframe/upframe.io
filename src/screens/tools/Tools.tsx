import React from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Spinner } from 'components'
import { useMe } from 'utils/hooks'
import Users from './users/Users'

export default function Tools() {
  const { me, loading } = useMe()

  if (loading) return <Spinner centered />
  if (me?.role !== 'ADMIN') return <Redirect to="/" />
  return (
    <>
      <Helmet>
        <title>Tools | Upframe</title>
      </Helmet>
      <S.Page>
        <Switch>
          <Route path="/tools/users" component={Users} />
          <Redirect exact from="/tools" to="/tools/users" />
        </Switch>
      </S.Page>
    </>
  )
}

const S = {
  Page: styled.div`
    padding: 3rem;
  `,
}
