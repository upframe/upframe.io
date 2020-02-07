import React, { Suspense, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { BrowserRouter as Router } from 'react-router-dom'
import { Navbar, Spinner } from './components'
import Routes from './Routes'
import mixpanel from 'mixpanel-browser'
import Api from './utils/Api'
import Context from './context'

export default function App() {
  const [ctx, setCtx] = useState({
    loggedIn: false,
    user: {},
    searchQuery: '',
    setProfilePic(profilePic) {
      setCtx({ ...ctx, user: { ...ctx.user, profilePic } })
    },
  })

  function login(email, password) {
    localStorage.clear()
    Api.login(email, password).then(({ ok, code }) => {
      if (ok !== 1 || code !== 200) return ctx.showToast("Couldn't log you in")
      Api.getUserInfo().then(({ user }) => {
        setCtx({ ...ctx, user, loggedIn: true })
      })
    })
  }
  function logout() {
    localStorage.clear()
    Api.logout().then(({ ok }) => {
      if (ok !== 1) return ctx.showToast("Couldn't log you out")
      setCtx({ ...ctx, user: {} })
      window.location = '/login'
    })
  }
  function saveUserInfo(user) {
    Api.updateUserInfo(user).then(({ ok }) => {
      if (!ok)
        return ctx.showToast('There was a problem saving your information')
      setCtx({ ...ctx, user })
      ctx.showToast('Information saved')
    })
  }
  function showToast(text) {
    let x = document.getElementById('snackbar')
    x.innerHTML = text
    x.className = 'show'
    setTimeout(function() {
      x.className = x.className.replace('show', '')
    }, 2000)
  }

  function setSearchQuery(searchQuery) {
    setCtx({ ...ctx, searchQuery })
  }

  useEffect(() => {
    if (ctx.loggedIn) return
    mixpanel.init('993a3d7a78434079b7a9bec245dbaec2')
    Api.getUserInfo().then(({ ok, code, user }) => {
      if (ok !== 1 || code !== 200) return
      if (user.tags !== '') user.tags = '[]'
      setCtx({ ...ctx, user, loggedIn: true })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        <div className="App">
          <Context.Provider
            value={{
              ...ctx,
              login,
              logout,
              saveUserInfo,
              showToast,
              setSearchQuery,
            }}
          >
            <Navbar />
            <Suspense fallback={<Spinner />}>
              <Routes />
            </Suspense>
            <div id="snackbar" />
          </Context.Provider>
        </div>
      </Router>
    </>
  )
}
