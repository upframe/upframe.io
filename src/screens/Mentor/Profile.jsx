import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { Breadcrumbs, RecommendationCard, Spinner } from '../../components'
import styles from './profile.module.scss'
import Showcase from './Showcase'
import Meetup from './Meetup'
import { useQuery, queries, hasError } from 'gql'
import { Helmet } from 'react-helmet'
import Conversation from 'conversations/conversation'

const recommend = {
  malik: ['pf', 'hugo.franca'],
  pf: ['hugo.franca', 'gui'],
  fbaiodias: ['miukimiu', 'sebastian.jespersen'],
  tiagopedras: ['pf', 'hugo.franca'],
}

const slotsAfter = new Date().toISOString()

export default function Profile({ match }) {
  const [conId, setConId] = useState()

  const { data: { user = {} } = {}, loading, error } = useQuery(
    queries.PROFILE,
    {
      variables: {
        handle: match.params.handle,
        slotsAfter,
      },
    }
  )

  useEffect(() => {
    setConId(Conversation.getByUsers([user.id])?.id)
    Conversation.onStatic('added', () =>
      setConId(Conversation.getByUsers([user.id])?.id)
    )
  }, [user.id])

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
      <Showcase user={user} conId={conId} />
      {user.role !== 'USER' && (
        <>
          <Meetup mentor={user} />
          {user.handle in recommend && (
            <RecommendationCard recommendations={recommend[user.handle]} />
          )}
        </>
      )}
    </main>
  )
}
