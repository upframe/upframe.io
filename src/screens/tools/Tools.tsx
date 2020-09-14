import React from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'
import { Redirect } from 'react-router-dom'
import { Spinner } from 'components'
import { useMe } from 'utils/hooks'

export default function Tools() {
  const { me, loading } = useMe()

  if (loading) return <Spinner centered />
  if (me?.role !== 'ADMIN') return <Redirect to="/" />
  return (
    <>
      <Helmet>
        <title>Tools | Upframe</title>
      </Helmet>
      <S.Page></S.Page>
    </>
  )
}

const S = {
  Page: styled.div``,
}
