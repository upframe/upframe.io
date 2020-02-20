import React, { Suspense, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { BrowserRouter as Router } from 'react-router-dom'
import { Navbar, Spinner, NotificationStack } from './components'
import Routes from './Routes'
import mixpanel from 'mixpanel-browser'
import Context from './context'
import styles from './styles/app.module.scss'
import { queries, useQuery } from './gql'

export default function App() {
  const [ctx, setCtx] = useState({
    currentUser: null,
  })

  function setSearchQuery(searchQuery) {
    setCtx({ ...ctx, searchQuery })
  }

  function setCurrentUser(currentUser) {
    setCtx({ ...ctx, currentUser })
  }

  useEffect(() => {
    if (ctx.loggedIn) return
    mixpanel.init('993a3d7a78434079b7a9bec245dbaec2')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useQuery(queries.ME, {
    skip: ctx.currentUser,
    errorPolicy: 'ignore',
    onCompleted: ({ me }) => {
      if (me) setCurrentUser(me.keycode)
    },
  })

  return (
    <>
      <Helmet>
        <title>Upframe</title>
        <meta
          property="description"
          content="Upframe connects students with leaders in tech, design and product through 1-1 mentoring worldwide. Keep Pushing Forward."
        ></meta>
        <meta property="language" content="EN"></meta>
        <meta property="copyright" content="Upframe"></meta>
        <meta property="og:url" content={`${window.location.origin}`}></meta>
        <meta property="og:title" content="Upframe"></meta>
        <meta
          property="og:description"
          content="Upframe connects students with leaders in tech, design and product through 1-1 mentoring worldwide. Keep Pushing Forward."
        ></meta>
        <meta
          property="og:image"
          content={`${window.location.origin}/keep-pushing-forward.jpg`}
        ></meta>
        <meta property="og:site_name" content="Upframe"></meta>
        <meta name="twitter:card" content="summary_large_image"></meta>
      </Helmet>
      <Router>
        <Context.Provider
          value={{
            ...ctx,
            setSearchQuery,
            setCurrentUser,
          }}
        >
          <div className={styles.app}>
            <Navbar />
            <Suspense fallback={<Spinner centered />}>
              <Routes />
            </Suspense>
            <NotificationStack />
          </div>
        </Context.Provider>
      </Router>
    </>
  )
}
