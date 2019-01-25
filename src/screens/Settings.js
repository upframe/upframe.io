import React, { Component } from 'react';

import { Redirect } from 'react-router-dom'

import SettingsPublicTab from '../components/SettingsPublicTab'
import SettingsAccountTab from '../components/SettingsAccountTab'
import SettingsSyncTab from '../components/SettingsSyncTab'

import AppContext from '../components/AppContext'

export default class Settings extends Component {

  static contextType = AppContext

  constructor(props) {
    super(props)
    this.state = {
      currentTab: 1
    }
  }

  viewPublicTab = () => {this.setState({ currentTab : 1 })}
  viewAccountTab = () => { this.setState({ currentTab: 2 }) }
  viewSyncTab = () => { this.setState({ currentTab: 3 }) }

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
            <label className={this.state.currentTab === 1 ? 'active': null} onClick={this.viewPublicTab}>Public Profile</label>
            <label className={this.state.currentTab === 2 ? 'active': null} onClick={this.viewAccountTab}>Account Settings</label>
            <label className={this.state.currentTab === 3 ? 'active': null} onClick={this.viewSyncTab}>Calendar Sync</label>
          </div>
          {this.renderCurrentTab()}
        </main>
      );
    } else {
      return <Redirect to='/login' />
    }
  }
}