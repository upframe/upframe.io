import React from 'react'
import { Helmet } from 'react-helmet'
import Profile from './Profile'
import Account from './Account'
import CalendarTab from './CalendarTab'
import Navigation from './Navigation'
import Notifications from './Notifications'
import { Route, Switch, Redirect } from 'react-router-dom'
import styles from './Settings.module.scss'
import { useMe } from 'utils/hooks'
import { Spinner, MentorRoute } from '../../components'
import Invite from './Invite'

export default function Settings() {
  const { me, loading } = useMe()

  if (!me) return loading ? <Spinner centered /> : <Redirect to="/login" />
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
            <MentorRoute path="/settings/invite" component={Invite} />
            <MentorRoute path="/settings/calendar" component={CalendarTab} />
            <Redirect exact from="/settings/sync" to="/settings/calendar" />
            <Redirect
              exact
              from="/settings/mycalendar"
              to="/settings/calendar"
            />
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
