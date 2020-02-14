import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Breadcrumbs, RecommendationCard, Spinner } from '../../components'
import styles from './profile.module.scss'
import Showcase from './Showcase'
import Meetup from './Meetup'
import Request from './Request'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import fragments from '../../gql/fragments'
import { hasError } from '../../api'

const recommend = {
  malik: ['pf', 'hugo.franca'],
  pf: ['hugo.franca', 'gui'],
  fbaiodias: ['miukimiu', 'sebastian.jespersen'],
  tiagopedras: ['pf', 'hugo.franca'],
}

const PROFILE_QUERY = gql`
  query MentorProfile($keycode: String!) {
    mentor(keycode: $keycode) @connection(key: $keycode) {
      ...LandingPageMentor
    }
  }
  ${fragments.landingPage.mentor}
`

export default function Profile({ match }) {
  const [showRequest, toggleRequest] = useState(false)

  const { data: { mentor } = {}, loading, error } = useQuery(PROFILE_QUERY, {
    variables: { keycode: match.params.keycode },
  })

  if (hasError(error, 'KEYCODE_ERROR')) return <Redirect to="/404" />
  if (loading) return <Spinner centered />
  return (
    <main className={styles.profile}>
      <Breadcrumbs name={mentor.name} />
      <Showcase mentor={mentor} />
      <Meetup
        mentor={mentor}
        onSlot={toggleRequest}
        onMsg={() => toggleRequest(true)}
      />
      {showRequest && (
        <Request
          mentor={mentor}
          {...(typeof showRequest === 'string' && { slot: showRequest })}
          onClose={() => toggleRequest(false)}
        />
      )}
      {mentor.keycode in recommend && (
        <RecommendationCard recommendations={recommend[`${mentor.keycode}`]} />
      )}
    </main>
  )
}
