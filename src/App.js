import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/Navbar';
import Main from './screens/Main';
import Login from './screens/Login';
import Onboarding from './screens/Onboarding';
import Settings from './screens/Settings';
import ChangeEmail from './screens/ChangeEmail';
import ResetPassword from './screens/ResetPassword';
import People from './screens/People';
import Expertise from './screens/Expertise';
import Meetup from './screens/Meetup';
import Company from './screens/Company';
import ErrorPage from './screens/404';

import DevPlayground from './screens/DevPlayground';
import Sync from './components/SettingsSyncTab';

import * as Api from './utils/Api';

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false
    }
  }

  componentDidMount() {
    Api.getUserInfo().then((res) => {
      if (res.ok === 1) {
        this.setState({
          loggedIn : true
        })
      } else {
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

  MeetupConfirm = () => {
    return (
      <Meetup confirm={1} />
    )
  }

  MeetupRefuse = () => {
    return (
      <Meetup confirm={0} />
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
            
            <Route exact path='/settings' component={this.SettingsScreen} />
            <Route exact path='/404' component={ErrorPage} />

            <Route exact path='/changemyemail*' component={ChangeEmail} />
            <Route exact path='/resetmypassword*' component={ResetPassword} />

            <Route exact path='/meetup/confirm*' component={this.MeetupConfirm} />
            <Route exact path='/meetup/refuse*' component={this.MeetupRefuse} />

            <Route exact path='/expertise*' component={Expertise} />
            <Route exact path='/company*' component={Company} />

            <Route exact path='/dev' component={DevPlayground} />
            <Route exact path='/dev2' component={Sync} />

            <Route exact path='/onboarding/:keycode' component={Onboarding} />
            <Route exact path='/:keycode' component={People} />
            <Route component={ErrorPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}
