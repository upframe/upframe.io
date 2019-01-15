import React, { Component } from 'react';

import { Redirect } from 'react-router-dom'

import SettingsPublicTab from '../components/SettingsPublicTab'
import SettingsAccountTab from '../components/SettingsAccountTab'
import SettingsSyncTab from '../components/SettingsSyncTab'

export default class Settings extends Component {

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
    if (this.props.loggedIn) {
      return (
        <div>
          <button onClick={this.viewPublicTab}>Public Tab</button>
          <button onClick={this.viewAccountTab}>Account Tab</button>
          <button onClick={this.viewSyncTab}>Sync Tab</button>
          {this.renderCurrentTab()}
        </div>
      );
    } else {
      return <Redirect to='/login' />
    }
  }
}