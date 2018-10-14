import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Navbar from './components/Navbar'
//Our app is made of a Navbar + Screen
import Main from './screens/Main'
import Login from './screens/Login'
import Mentor from './screens/Mentor'
import Onboarding from './screens/Onboarding'
import Settings from './screens/Settings'

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false
    }
  }

  LoginScreen = () => {
    return (
      <Login loggedIn={this.state.loggedIn} setLoggedInState={this.setLoggedInState} />
    )
  }

  SettingsScreen = () => {
    return (
      <Settings loggedIn={this.state.loggedIn} />
    )
  }

  setLoggedInState = (newState) => {
    this.setState({
      loggedIn: newState
    })
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Navbar loggedIn={this.state.loggedIn} setLoggedInState={this.setLoggedInState}/>
          <Switch>
            <Route exact path='/' component={Main} />
            <Route exact path='/login' component={this.LoginScreen} />
            <Route exact path='/mentor' component={Mentor} />
            <Route exact path='/onboarding' component={Onboarding} />
            <Route exact path='/settings' component={this.SettingsScreen} />
          </Switch>
        </div>
      </Router>
    );
  }
}
