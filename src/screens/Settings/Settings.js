import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import AppContext from '../../components/AppContext'
import Profile from './Profile'
import Account from './Account'
import CalendarTab from './CalendarTab'
import Navigation from './Navigation'
import Notifications from './Notifications'
import { Route, Switch, Redirect } from 'react-router-dom'
import styles from './Settings.module.scss'

export default function Settings() {
  const ctx = useContext(AppContext)
  if (!ctx.loggedIn) return null

  return (
    <React.Fragment>
      <Helmet>
        <title>Settings | Upframe</title>
        <meta property="og:title" content="Settings | Upframe"></meta>
        <meta
          property="og:description"
          content="Change your profile information and settings"
        ></meta>
        <meta property="og:image" content="/media/logo-app-192.png"></meta>
        <meta name="twitter:card" content="summary_large_image"></meta>
      </Helmet>
      <main id="settings" className={styles.settings}>
        <Navigation />
        <div className={styles.rightColumn}>
          <Switch>
            <Route path="/settings/public" component={Profile} />
            <Route path="/settings/account" component={Account} />
            <Route path="/settings/notifications" component={Notifications} />
            <Route path="/settings/mycalendar" component={CalendarTab} />
            <Redirect from="/settings/sync" to="/settings/mycalendar" />
          </Switch>
        </div>
      </main>
    </React.Fragment>
  )
}
