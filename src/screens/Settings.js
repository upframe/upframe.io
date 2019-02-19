import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom'

import SettingsPublicTab from '../components/SettingsPublicTab'
import SettingsAccountTab from '../components/SettingsAccountTab'
import SettingsSyncTab from '../components/SettingsSyncTab'

import AppContext from '../components/AppContext'

export default class Settings extends Component {

  static contextType = AppContext

  constructor(props) {
    super(props)

    let currentTab = 1
    if (props.match.params.page === 'public') {
      currentTab = 1
    } else if (props.match.params.page === 'account') {
      currentTab = 2
    } else if (props.match.params.page === 'sync') {
      currentTab = 3
    }
    this.state = {currentTab}
  }

  // viewPublicTab = () => {this.setState({ currentTab : 1 })}
  // viewAccountTab = () => { this.setState({ currentTab: 2 }) }
  // viewSyncTab = () => { this.setState({ currentTab: 3 }) }

  componentDidUpdate(prevProps) {
    if (prevProps.match !== this.props.match) {
      let currentTab = 1
      if (this.props.match.params.page === 'public') {
        currentTab = 1
      } else if (this.props.match.params.page === 'account') {
        currentTab = 2
      } else if (this.props.match.params.page === 'sync') {
        currentTab = 3
      }
      this.setState({ currentTab })
    }
  }

  renderCurrentTab = () => {
    if (this.state.currentTab === 1) {
      return <SettingsPublicTab />
    } else if (this.state.currentTab === 2) {
      return <SettingsAccountTab />
    } else {
      return <SettingsSyncTab />
    }
  }

  render() {
    if (this.context.loggedIn) {
      return (
        <main id='settings' className='grid'>
          <div id='tablist'>
            <Link to='/settings/public'><label className={this.state.currentTab === 1 ? 'active' : null}>Public Profile</label></Link>
            <Link to='/settings/account'><label id="account-label" className={this.state.currentTab === 2 ? 'active' : null}>Account Settings</label></Link>
            <Link to='/settings/sync'><label id="sync-label" className={this.state.currentTab === 3 ? 'active' : null}>Calendar Sync</label></Link>
          </div>
          {this.renderCurrentTab()}
        </main>
      );
    } else {
      return <Redirect to='/login' />
    }
  }
}