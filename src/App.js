import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
/* Routes */
import Navbar from './components/Navbar';
// import Main from './screens/Main';
import Login from './screens/Login'; //needs props
// import Onboarding from './screens/Onboarding';
import Settings from './screens/Settings'; //needs props
// import ChangeEmail from './screens/ChangeEmail';
// import ResetPassword from './screens/ResetPassword';
// import People from './screens/People';
// import Expertise from './screens/Expertise';
import Meetup from './screens/Meetup'; //needs props
// import Company from './screens/Company';
// import ErrorPage from './screens/404';
// import DevPlayground from './screens/DevPlayground';
// import GoogleSync from './components/Sync';
/* End of Routes */

import * as Api from './utils/Api';

const MyLoadingComponent = ({ isLoading, error }) => {
  // Handle the loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }
  // Handle the error state
  else if (error) {
    return <div>Sorry, there was a problem loading the page.</div>;
  }
  else {
    return null;
  }
};
/* Let's setup loadables here */
const AsyncMain = Loadable({
  loader: () => import('./screens/Main'),
  loading: MyLoadingComponent
});

// const AsyncLogin = Loadable({ //Needs props
//   loader: () => import('./screens/Login'),
//   loading: MyLoadingComponent,
//   render(loaded, props) {
//     let Component = loaded.namedExport;
//     return <Component {...props} />
//   }
// });
const AsyncOnboarding = Loadable({
  loader: () => import('./screens/Onboarding'),
  loading: MyLoadingComponent
});
// const AsyncSettings = Loadable({ //Needs props
//   loader: () => import('./screens/Settings'),
//   loading: MyLoadingComponent
// });
const AsyncChangeEmail = Loadable({
  loader: () => import('./screens/ChangeEmail'),
  loading: MyLoadingComponent
});
const AsyncResetPassword = Loadable({
  loader: () => import('./screens/ResetPassword'),
  loading: MyLoadingComponent
});
const AsyncPeople = Loadable({
  loader: () => import('./screens/People'),
  loading: MyLoadingComponent
});
const AsyncExpertise = Loadable({
  loader: () => import('./screens/Expertise'),
  loading: MyLoadingComponent
});
// const AsyncMeetup = Loadable({ //Needs props
//   loader: () => import('./screens/Meetup'),
//   loading: MyLoadingComponent
// });
const AsyncCompany = Loadable({
  loader: () => import('./screens/Company'),
  loading: MyLoadingComponent
});
const AsyncErrorPage = Loadable({
  loader: () => import('./screens/404'),
  loading: MyLoadingComponent
});
const AsyncDevPlayground = Loadable({
  loader: () => import('./screens/DevPlayground'),
  loading: MyLoadingComponent
});
const AsyncGoogleSync = Loadable({
  loader: () => import('./components/Sync'),
  loading: MyLoadingComponent
});

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
            <Route exact path='/' component={AsyncMain} />
            <Route exact path='/login' component={this.LoginScreen} />
            
            <Route exact path='/settings' component={this.SettingsScreen} />
            <Route exact path='/404' component={AsyncErrorPage} />

            <Route exact path='/changemyemail*' component={AsyncChangeEmail} />
            <Route exact path='/resetmypassword*' component={AsyncResetPassword} />

            <Route exact path='/meetup/confirm*' component={this.MeetupConfirm} />
            <Route exact path='/meetup/refuse*' component={this.MeetupRefuse} />
            <Route exact path='/sync' component={AsyncGoogleSync} />

            <Route exact path='/expertise*' component={AsyncExpertise} />
            <Route exact path='/company*' component={AsyncCompany} />

            <Route exact path='/dev' component={AsyncDevPlayground} />
            <Route exact path='/dev2' component={AsyncGoogleSync} />

            <Route exact path='/onboarding/:keycode' component={AsyncOnboarding} />
            <Route exact path='/:keycode' component={AsyncPeople} />
            <Route component={AsyncErrorPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}
