import React, { Suspense, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './Routes'
import { useMessaging } from './conversations'
import styled from 'styled-components'
import { mobile } from 'styles/responsive'
import layout from 'styles/layout'
import { useMe, useVirtualKeyboard } from 'utils/hooks'
import { useNavbar } from 'utils/navigation'
import {
  Navbar,
  Spinner,
  NotificationStack,
  ScrollToTop,
  MobileNav,
} from './components'

export default function App() {
  useMessaging()
  const { visible } = useNavbar()
  const keyboardOpen = useVirtualKeyboard()

  const { me, loading } = useMe()

  useEffect(() => {
    if (loading) return
    localStorage.setItem('loggedIn', !!me)
  }, [me, loading])

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
        <S.App mobileNav={visible} keyboard={keyboardOpen}>
          <Navbar />
          <Suspense fallback={<Spinner centered />}>
            <ScrollToTop />
            <Routes />
          </Suspense>
          <NotificationStack />
          <MobileNav />
        </S.App>
      </Router>
    </>
  )
}

const S = {
  App: styled.div`
    margin-top: ${layout.desktop.navbarHeight};
    padding-top: 1rem;

    @media ${mobile} {
      margin-top: 0;
      margin-bottom: ${({ mobileNav, keyboard }) =>
        mobileNav && !keyboard ? layout.mobile.navbarHeight : '0'};
    }
  `,
}
