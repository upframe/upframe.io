import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Navbar from './components/Navbar'
//Our app is made of a Navbar + Screen
import Main from './screens/Main'
import Login from './screens/Login'
import Mentor from './screens/Mentor'
import Onboarding from './screens/Onboarding'
import Settings from './screens/Settings'
import ChangeEmail from './screens/ChangeEmail'
import ResetPassword from './screens/ResetPassword'

import DevPlayground from './screens/DevPlayground'

import * as Cookies from './utils/Cookies'
import * as Api from './utils/Api'

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false
    }
  }

  componentDidMount() {
    console.log(Cookies.getItem('access_token'))
    Api.getUserInfo().then(res => {
      if (res.ok === 1) {
        this.setState({
          loggedIn : true
        })
      } else {
        Cookies.clear()
        this.setState({
          loggedIn : false
        })
      }
    })
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

            <Route exact path='/changemyemail*' component={ChangeEmail} />
            <Route exact path='/resetmypassword*' component={ResetPassword} />

            <Route exact path='/dev' component={DevPlayground} />
          </Switch>
        </div>
      </Router>
    );
  }
}
