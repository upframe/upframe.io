import React, { Component, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AppContext from './components/AppContext';
import Navbar from './components/Navbar';
import * as Api from './utils/Api';

const Main = React.lazy(() => import(/* webpackChunkName: "Main", webpackPrefetch: true */'./screens/Main'))
const Login = React.lazy(() => import(/* webpackChunkName: "Login", webpackPrefetch: true */'./screens/Login'))
const Onboarding = React.lazy(() => import(/* webpackChunkName: "Onboarding", webpackPrefetch: true */'./screens/Onboarding'))
const Settings = React.lazy(() => import(/* webpackChunkName: "Settings", webpackPrefetch: true */'./screens/Settings'))
const ChangeEmail = React.lazy(() => import(/* webpackChunkName: "ChangeEmail", webpackPrefetch: true */'./screens/ChangeEmail'))
const ResetPassword = React.lazy(() => import(/* webpackChunkName: "ResetPassword", webpackPrefetch: true */'./screens/ResetPassword'))
const People = React.lazy(() => import(/* webpackChunkName: "People", webpackPrefetch: true */'./screens/People'))
const Expertise = React.lazy(() => import(/* webpackChunkName: "Expertise", webpackPrefetch: true */'./screens/Expertise'))
const MeetupConfirm = React.lazy(() => import(/* webpackChunkName: "MeetupConfirm", webpackPrefetch: true */'./screens/MeetupConfirm'))
const MeetupRefuse = React.lazy(() => import(/* webpackChunkName: "MeetupRefuse", webpackPrefetch: true */'./screens/MeetupRefuse'))
const Company = React.lazy(() => import(/* webpackChunkName: "Company", webpackPrefetch: true */'./screens/Company'))
const ErrorPage = React.lazy(() => import(/* webpackChunkName: "ErrorPage", webpackPrefetch: true */'./screens/404'))
const DevPlayground = React.lazy(() => import(/* webpackChunkName: "DevPlayground", webpackPrefetch: true */'./screens/DevPlayground'))
const GoogleSync = React.lazy(() => import(/* webpackChunkName: "GoogleSync", webpackPrefetch: true */'./screens/Sync'))

export default class App extends Component {

  state = {
    loggedIn: false,
    user: {}
  }

  login = (email, password) => {
    Api.login(email, password).then((res) => {
      if (res.ok === 1) {
        Api.getUserInfo().then((res) => {
          if (res.ok === 1 && res.code === 200) {
            this.setState({
              user: res.user,
              loggedIn: true
            })
            return "Login successful"
          }
        })
      } else {
        return "Could not log you in"
      }
    })
  }

  logout = () => {
    Api.logout().then((res) => {
      if (res === 1) {
        this.setState({
          loggedIn: false
        })
        return "Logged out"
      } else {
        return "Could not log you out"
      }
    })
  }

  saveUserInfo = (user) => {
    Api.updateUserInfo(user).then((res) => {
      if (res.ok === 1) {
        this.setState({
          user: user
        })
        return "Information saved"
      } else {
        return "There was a problem saving your information"
      }
    })
  }

  componentDidMount() {
    Api.getUserInfo().then((res) => {
      if (res.ok === 1 && res.code === 200) {
        this.setState({
          user: res.user,
          loggedIn: true
        })
      }
    })
  }

  render() {
    let contextValue = {
      loggedIn: this.state.loggedIn,
      user: this.state.user,
      login: this.login,
      logout: this.logout,
      saveUserInfo: this.saveUserInfo
    }
    return (
      <Router>
        <div className="App">
        <AppContext.Provider value={contextValue}>
          <Navbar />
          <Suspense fallback={<div>Loading...</div>}> 
            <Switch>
                <Route exact path='/' component={Main}/>
                <Route exact path='/login' component={Login} />
                <Route exact path='/settings' component={Settings} />
                <Route exact path='/404' component={ErrorPage} />
                <Route exact path='/changemyemail/:token' component={ChangeEmail} />
                <Route exact path='/resetmypassword/:token' component={ResetPassword} />
                <Route exact path='/meetup/confirm/:meetupid' component={MeetupConfirm} />
                <Route exact path='/meetup/refuse/:meetupid' component={MeetupRefuse} />
                <Route exact path='/sync' component={GoogleSync} />
                <Route exact path='/expertise/:expertise' component={Expertise} />
                <Route exact path='/company/:company' component={Company} />
                <Route exact path='/dev' component={DevPlayground} />
                <Route exact path='/onboarding/:keycode' component={Onboarding} />
                <Route exact path='/:keycode' component={People} />
                <Route component={ErrorPage} />
            </Switch>
          </Suspense>
        </AppContext.Provider>
        </div>
      </Router>
    );
  }
}
