import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Breadcrumbs, RecommendationCard, Spinner } from '../../components'
import styles from './profile.module.scss'
import Showcase from './Showcase'
import Meetup from './Meetup'
import Request from './Request'
import { useQuery, queries, hasError } from '../../gql'

const recommend = {
  malik: ['pf', 'hugo.franca'],
  pf: ['hugo.franca', 'gui'],
  fbaiodias: ['miukimiu', 'sebastian.jespersen'],
  tiagopedras: ['pf', 'hugo.franca'],
}

export default function Profile({ match }) {
  const [showRequest, toggleRequest] = useState(false)

  const { data: { mentor } = {}, loading, error } = useQuery(queries.PROFILE, {
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
