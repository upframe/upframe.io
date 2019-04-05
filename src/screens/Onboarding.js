import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import Api from '../utils/Api';


import OnboardingWelcomeTab from '../components/OnboardingWelcomeTab'
import OnboardingPasswordTab from '../components/OnboardingPasswordTab'
import OnboardingAllDoneTab from '../components/OnboardingAllDoneTab'

export default class Onboarding extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentTab: 1
    }

    let keycode = window.location.pathname.split('/')[1]
    Api.verifyKeycode(keycode).then((res) => {
      if (res.ok === 0) {
        this.setState({
          currentTab : 4
        })
      }
    })
  }

  viewWelcomeTab = () => { this.setState({ currentTab: 1 }) }

  viewPasswordTab = (res) => { this.setState({ currentTab: 2, propsToPass: res }) }

  viewAllDoneTab = () => { this.setState({ currentTab: 3 }) }

  renderCurrentTab = () => {
    if (this.state.currentTab === 1) {
      return <OnboardingWelcomeTab next={this.viewPasswordTab}/>
    } else if (this.state.currentTab === 2) {
      return <OnboardingPasswordTab next={this.viewAllDoneTab} data={this.state.propsToPass}/>
    } else if (this.state.currentTab === 3) {
      return <OnboardingAllDoneTab />
    } else {
      return <Redirect to='/404' />
    }
  }

  render() {
    return (
      <div>
        {this.renderCurrentTab()}
      </div>
    );
  }
}