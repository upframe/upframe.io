import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import { Link } from 'react-router-dom'

import SettingsPublicTab from '../components/SettingsPublicTab'
import SettingsAccountTab from '../components/SettingsAccountTab'
import CalendarTab from './Settings/CalendarTab'

import AppContext from '../components/AppContext'

export default class Settings extends Component {
  static contextType = AppContext

  renderCurrentTab = () => {
    if (this.props.match.params.page === 'public') {
      return <SettingsPublicTab />
    } else if (this.props.match.params.page === 'account') {
      return <SettingsAccountTab />
    } else {
      return <CalendarTab />
    }
  }

  render() {
    if (!this.context.loggedIn) {
      return null
    } else {
      return (
        <React.Fragment>
          <Helmet>
            <title>Settings | Upframe</title>
            <meta property="og:title" content="Settings | Upframe"></meta>
            <meta
              property="og:description"
              content="Change your profile information and settings"
            ></meta>
            <meta
              property="og:image"
              content="/android-chrome-192x192.png"
            ></meta>
            <meta name="twitter:card" content="summary_large_image"></meta>
          </Helmet>

          <main id="settings" className="grid">
            <div id="tablist">
              <Link to="/settings/public">
                <label
                  className={
                    this.props.match.params.page === 'public' ? 'active' : null
                  }
                >
                  Public Profile
                </label>
              </Link>
              <Link to="/settings/account">
                <label
                  id="account-label"
                  className={
                    this.props.match.params.page === 'account' ? 'active' : null
                  }
                >
                  Account Settings
                </label>
              </Link>
              <Link to="/settings/sync">
                <label
                  id="sync-label"
                  className={
                    this.props.match.params.page === 'sync' ? 'active' : null
                  }
                >
                  Calendar Sync
                </label>
              </Link>
            </div>
            {this.renderCurrentTab()}
          </main>
        </React.Fragment>
      )
    }
  }
}
