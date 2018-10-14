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
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path='/' component={Main} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/mentor' component={Mentor} />
            <Route exact path='/onboarding' component={Onboarding} />
            <Route exact path='/settings' component={Settings} />
          </Switch>
        </div>
      </Router>
    );
  }
}
