import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/Navbar';
import * as Loadable from './components/LoadableComponents';

// import Main from './screens/Main';
// import People from './screens/People';

export default class App extends Component {

  state = {
    loggedIn: false
  }

  // componentDidMount() {
  //   Loadable.preload()
  // }

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
          <Switch>
            <Route exact path='/' component={Loadable.Main} />
            {/* <Route exact path='/' component={Main} /> */}
            <Route exact path='/login' component={Loadable.Login} />
            <Route exact path='/settings' component={Loadable.Settings} />
            <Route exact path='/404' component={Loadable.ErrorPage} />
            <Route exact path='/changemyemail/:token' component={Loadable.ChangeEmail} />
            <Route exact path='/resetmypassword/:token' component={Loadable.ResetPassword} />
            <Route exact path='/meetup/confirm/:meetupid' component={Loadable.Meetup} />
            <Route exact path='/meetup/refuse/:meetupid' component={Loadable.Meetup} />
            <Route exact path='/sync' component={Loadable.GoogleSync} />
            <Route exact path='/expertise/:expertise' component={Loadable.Expertise} />
            <Route exact path='/company/:company' component={Loadable.Company} />
            <Route exact path='/dev' component={Loadable.DevPlayground} />
            <Route exact path='/onboarding/:keycode' component={Loadable.Onboarding} />
            <Route exact path='/:keycode' component={Loadable.People} />
            {/* <Route exact path='/:keycode' component={People} /> */}
            <Route component={Loadable.ErrorPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}
