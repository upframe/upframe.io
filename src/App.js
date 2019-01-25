import React, { Component, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/Navbar';

const Main = React.lazy(() => import('./screens/Main'))
const Login = React.lazy(() => import('./screens/Login'))
const Onboarding = React.lazy(() => import('./screens/Onboarding'))
const Settings = React.lazy(() => import('./screens/Settings'))
const ChangeEmail = React.lazy(() => import('./screens/ChangeEmail'))
const ResetPassword = React.lazy(() => import('./screens/ResetPassword'))
const People = React.lazy(() => import('./screens/People'))
const Expertise = React.lazy(() => import('./screens/Expertise'))
const Meetup = React.lazy(() => import('./screens/Meetup'))
const Company = React.lazy(() => import('./screens/Company'))
const ErrorPage = React.lazy(() => import('./screens/404'))
const DevPlayground = React.lazy(() => import('./screens/DevPlayground'))
const GoogleSync = React.lazy(() => import('./screens/Sync'))

export default class App extends Component {

  state = {
    loggedIn: false
  }

  // componentDidMount() {
  //   Api.getUserInfo().then((res) => {
  //     if (res.ok === 1) {
  //       this.setState({
  //         loggedIn : true
  //       })
  //     } else {
  //       this.setState({
  //         loggedIn : false
  //       })
  //     }
  //   })
  // }

  // LoginScreen = () => {
  //   return (
  //     <Login loggedIn={this.state.loggedIn} setLoggedInState={this.setLoggedInState} />
  //   )
  // }

  // SettingsScreen = () => {
  //   return (
  //     <Settings loggedIn={this.state.loggedIn} />
  //   )
  // }

  // MeetupConfirm = () => {
  //   return (
  //     <Meetup confirm={1} />
  //   )
  // }

  // MeetupRefuse = () => {
  //   return (
  //     <Meetup confirm={0} />
  //   )
  // }

  // setLoggedInState = (newState) => {
  //   this.setState({
  //     loggedIn: newState
  //   })
  // }

  render() {
    return (
      <Router>
        <div className="App">
          <Navbar loggedIn={this.state.loggedIn} setLoggedInState={this.setLoggedInState}/>
          <Suspense fallback={<div>Loading...</div>}> 
            <Switch>
                <Route exact path='/' component={Main}/>
                <Route exact path='/login' component={Login} />
                <Route exact path='/settings' component={Settings} />
                <Route exact path='/404' component={ErrorPage} />
                <Route exact path='/changemyemail/:token' component={ChangeEmail} />
                <Route exact path='/resetmypassword/:token' component={ResetPassword} />
                <Route exact path='/meetup/confirm/:meetupid' component={Meetup} />
                <Route exact path='/meetup/refuse/:meetupid' component={Meetup} />
                <Route exact path='/sync' component={GoogleSync} />
                <Route exact path='/expertise/:expertise' component={Expertise} />
                <Route exact path='/company/:company' component={Company} />
                <Route exact path='/dev' component={DevPlayground} />
                <Route exact path='/onboarding/:keycode' component={Onboarding} />
                <Route exact path='/:keycode' component={People} />
                <Route component={ErrorPage} />
            </Switch>
          </Suspense>
        </div>
      </Router>
    );
  }
}
