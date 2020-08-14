import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Breadcrumbs, RecommendationCard, Spinner } from '../../components'
import styles from './profile.module.scss'
import Showcase from './Showcase'
import Meetup from './Meetup'
import Request from './Request'
import { useQuery, queries, hasError } from 'gql'
import { Helmet } from 'react-helmet'

const recommend = {
  malik: ['pf', 'hugo.franca'],
  pf: ['hugo.franca', 'gui'],
  fbaiodias: ['miukimiu', 'sebastian.jespersen'],
  tiagopedras: ['pf', 'hugo.franca'],
}

const slotsAfter = new Date().toISOString()

export default function Profile({ match }) {
  const [showRequest, toggleRequest] = useState(false)

  const { data: { user = {} } = {}, loading, error } = useQuery(
    queries.PROFILE,
    {
      variables: {
        handle: match.params.handle,
        slotsAfter,
      },
    }
  )

  if (hasError(error, 'KEYCODE_ERROR')) return <Redirect to="/404" />
  if (loading) return <Spinner centered />
  return (
    <main className={styles.profile}>
      <Helmet>
        <title>{user.name} | Upframe</title>
        <meta
          property="og:url"
          content={`${window.location.origin}/${user.handle}`}
        ></meta>
        <meta property="og:title" content={`${user.name} | Upframe`}></meta>
        <meta
          property="og:description"
          content={`Set up a meetup with ${user.name}. ${user.biography?.substr(
            0,
            128
          )}...`}
        ></meta>
        <meta
          property="og:image"
          content={
            user.profilePictures?.find(
              ({ size, type }) =>
                size ===
                  Math.max(...user.profilePictures.map(({ size }) => size)) &&
                type === 'jpeg'
            )?.url
          }
        ></meta>
        <meta name="twitter:card" content="summary_large_image"></meta>
      </Helmet>
      <Breadcrumbs name={user.name} />
      <Showcase user={user} />
      {user.role !== 'USER' && (
        <>
          <Meetup mentor={user} onSlot={toggleRequest} />
          {showRequest && (
            <Request
              mentor={user}
              {...(typeof showRequest === 'string' && { slot: showRequest })}
              onClose={() => toggleRequest(false)}
            />
          )}
          {user.handle in recommend && (
            <RecommendationCard recommendations={recommend[user.handle]} />
          )}
        </>
      )}
    </main>
  )
}
