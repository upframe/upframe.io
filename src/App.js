import React, { Component, Suspense } from 'react'
import { Helmet } from 'react-helmet'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import mixpanel from 'mixpanel-browser'

import AppContext from './components/AppContext'
import Navbar from './components/Navbar/'
import Api from './utils/Api'

const Main = React.lazy(() => import('./screens/Main'))
const Login = React.lazy(() =>
  import(
    /* webpackChunkName: "Login", webpackPrefetch: true */ './screens/Login'
  )
)
const Register = React.lazy(() =>
  import(
    /* webpackChunkName: "Register", webpackPrefetch: true */ './screens/Register'
  )
)
const Onboarding = React.lazy(() =>
  import(
    /* webpackChunkName: "Onboarding", webpackPrefetch: true */ './screens/Onboarding'
  )
)
const Settings = React.lazy(() =>
  import(
    /* webpackChunkName: "Settings", webpackPrefetch: true */ './screens/Settings'
  )
)
const ChangeEmail = React.lazy(() =>
  import(
    /* webpackChunkName: "ChangeEmail", webpackPrefetch: true */ './screens/ChangeEmail'
  )
)
const ResetPassword = React.lazy(() =>
  import(
    /* webpackChunkName: "ResetPassword", webpackPrefetch: true */ './screens/ResetPassword'
  )
)
const People = React.lazy(() =>
  import(
    /* webpackChunkName: "People", webpackPrefetch: true */ './screens/People'
  )
)
const Expertise = React.lazy(() =>
  import(
    /* webpackChunkName: "Expertise", webpackPrefetch: true */ './screens/Expertise'
  )
)
const MeetupConfirm = React.lazy(() =>
  import(
    /* webpackChunkName: "MeetupConfirm", webpackPrefetch: true */ './screens/MeetupConfirm'
  )
)
const MeetupRefuse = React.lazy(() =>
  import(
    /* webpackChunkName: "MeetupRefuse", webpackPrefetch: true */ './screens/MeetupRefuse'
  )
)
const Company = React.lazy(() =>
  import(
    /* webpackChunkName: "Company", webpackPrefetch: true */ './screens/Company'
  )
)
const ErrorPage = React.lazy(() =>
  import(
    /* webpackChunkName: "ErrorPage", webpackPrefetch: true */ './screens/404'
  )
)
const DevPlayground = React.lazy(() =>
  import(
    /* webpackChunkName: "DevPlayground", webpackPrefetch: true */ './screens/DevPlayground'
  )
)
const GoogleSync = React.lazy(() =>
  import(
    /* webpackChunkName: "GoogleSync", webpackPrefetch: true */ './screens/Sync'
  )
)
const MentorGroup = React.lazy(() =>
  import(
    /* webpackChunkName: "MentorGroup", webpackPrefetch: true */ './screens/MentorGroup'
  )
)

export default class App extends Component {
  state = {
    loggedIn: false,
    searchQuery: '',
    resetSearchQuery: false,
    user: {},
    changeSearcBarhWidth: false
  }

  componentDidMount() {
    Api.getUserInfo().then(res => {
      if (res.ok === 1 && res.code === 200) {
        this.setState({
          user: res.user,
          loggedIn: true,
        })
      }
    })
  }

  login = (email, password) => {
    Api.login(email, password).then(res => {
      if (res.ok === 1) {
        Api.getUserInfo().then(res => {
          if (res.ok === 1 && res.code === 200) {
            this.setState({
              user: res.user,
              loggedIn: true,
            })
          }
        })
      } else {
        alert('Could not log you in')
      }
    })
  }

  logout = () => {
    Api.logout().then(res => {
      if (res.ok === 1) {
        this.setState({
          loggedIn: false,
          user: {},
        })
        window.location = '/login'
      } else {
        alert('Could not log you out')
      }
    })
  }

  saveUserInfo = user => {
    Api.updateUserInfo(user).then(res => {
      if (res.ok === 1) {
        this.setState({
          user: user,
        })
        this.showToast('Information saved')
      } else {
        alert('There was a problem saving your information')
      }
    })
  }

  setProfilePic = url => {
    this.setState({
      user: {
        profilePic: url,
      },
    })
  }

  setSearchBarWidth = change => {
    this.setState({
      changeSearcBarhWidth: change ? true : false,
    })
  }

  setSearchQuery = (query, didSearchReset) => {
    this.setState({
      searchQuery: query,
      resetSearchQuery: didSearchReset ? true : false,
    })
  }

  showToast(text) {
    let x = document.getElementById('snackbar')
    x.innerHTML = text
    x.className = 'show'
    setTimeout(function() {
      x.className = x.className.replace('show', '')
    }, 2000)
  }

  render() {
    let contextValue = {
      login: this.login,
      logout: this.logout,
      loggedIn: this.state.loggedIn,
      searchQuery: this.state.searchQuery,
      setSearchQuery: this.setSearchQuery,
      resetSearchQuery: this.state.resetSearchQuery,
      setSearchBarWidth: this.setSearchBarWidth,
      changeSearcBarhWidth: this.state.changeSearcBarhWidth,
      saveUserInfo: this.saveUserInfo,
      setProfilePic: this.setProfilePic,
      showToast: this.showToast,
      user: this.state.user,
    }
    mixpanel.init('993a3d7a78434079b7a9bec245dbaec2')
    return (
      <>
        <Helmet>
          <title>Upframe</title>
          <meta
            property="description"
            content={
              'Upframe connects students with leaders in tech, design and product through 1-1 mentoring worldwide. Keep Pushing Forward.'
            }
          ></meta>
          <meta property="language" content="EN"></meta>
          <meta property="copyright" content="Upframe"></meta>
          <meta property="og:url" content={`${window.location.origin}`}></meta>
          <meta property="og:title" content={'Upframe'}></meta>
          <meta
            property="og:description"
            content={
              'Upframe connects students with leaders in tech, design and product through 1-1 mentoring worldwide. Keep Pushing Forward.'
            }
          ></meta>
          <meta
            property="og:image"
            content={`${window.location.origin}/keep-pushing-forward.jpg`}
          ></meta>
          <meta property="og:site_name" content={'Upframe'}></meta>
          <meta name="twitter:card" content="summary_large_image"></meta>
        </Helmet>
        <Router>
          <div className="App">
            <AppContext.Provider value={contextValue}>
              <Navbar />
              <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                  <Route exact path="/" component={Main} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/settings" component={Settings} />
                  <Route exact path="/settings/:page" component={Settings} />
                  <Route exact path="/404" component={ErrorPage} />
                  <Route
                    exact
                    path="/changemyemail/:token"
                    component={ChangeEmail}
                  />
                  <Route
                    exact
                    path="/resetmypassword/:token"
                    component={ResetPassword}
                  />
                  <Route
                    exact
                    path="/meetup/confirm/:meetupid"
                    component={MeetupConfirm}
                  />
                  <Route
                    exact
                    path="/meetup/refuse/:meetupid"
                    component={MeetupRefuse}
                  />
                  <Route exact path="/sync" component={GoogleSync} />
                  <Route
                    exact
                    path="/expertise/:expertise"
                    component={Expertise}
                  />
                  <Route exact path="/company/:company" component={Company} />
                  <Route exact path="/dev" component={DevPlayground} />
                  <Route
                    exact
                    path="/onboarding/:keycode"
                    component={Onboarding}
                  />
                  <Route exact path="/product" component={MentorGroup} />
                  <Route exact path="/design" component={MentorGroup} />
                  <Route exact path="/software" component={MentorGroup} />
                  <Route exact path="/:keycode" component={People} />
                  <Route component={ErrorPage} />
                </Switch>
              </Suspense>
              <div id="snackbar">Information saved</div>
            </AppContext.Provider>
          </div>
        </Router>
      </>
    )
  }
}
