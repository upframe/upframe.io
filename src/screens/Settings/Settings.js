import React from 'react'
import { Helmet } from 'react-helmet'
import Profile from './Profile'
import Account from './Account'
import CalendarTab from './CalendarTab'
import Navigation from './Navigation'
import Notifications from './Notifications'
import { Route, Switch, Redirect } from 'react-router-dom'
import styles from './Settings.module.scss'
import { useCtx, useMe } from '../../utils/Hooks'
import { Spinner } from '../../components'

export default function Settings() {
  const { currentUser } = useCtx()
  const me = useMe()
  if (!currentUser) return null

  if (!me) return <Spinner centered />
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
            {me && me.role === 'MENTOR' && (
              <>
                <Route path="/settings/mycalendar" component={CalendarTab} />
                <Redirect
                  exact
                  from="/settings/sync"
                  to="/settings/mycalendar"
                />
                <Redirect
                  exact
                  from="/settings/calendar"
                  to="/settings/mycalendar"
                />
              </>
            )}

            <Redirect exact from="/settings" to="/settings/public" />
            <Route>
              <Redirect to="/404" />
            </Route>
          </Switch>
        </div>
      </main>
    </React.Fragment>
  )
}
