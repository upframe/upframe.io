import React, { Component, Suspense } from 'react'
import { Helmet } from 'react-helmet'
import { BrowserRouter as Router } from 'react-router-dom'
import mixpanel from 'mixpanel-browser'

import AppContext from './components/AppContext'
import { Navbar } from './components'
import Api from './utils/Api'
import Routes from './Routes'

export default class App extends Component {
  state = {
    loggedIn: false,
    searchQuery: '',
    isSearchQuery: false,
    user: {},
    changeSearcBarhWidth: false,
  }

  componentDidMount() {
    Api.getUserInfo().then(res => {
      if (res.ok === 1 && res.code === 200) {
        this.setState({
          user: {
            ...res.user,
            tags: res.user.tags !== '' ? res.user.tags : '[]',
          },
          loggedIn: true,
        })
      }
    })
  }

  login = (email, password) => {
    localStorage.clear()
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
    localStorage.clear()
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

  startSearchQuery = didSearchReset => {
    this.setState({
      isSearchQuery: didSearchReset ? true : false,
    })
  }

  setSearchQuery = query => {
    this.setState({
      searchQuery: query,
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
      isSearchQuery: this.state.isSearchQuery,
      startSearchQuery: this.startSearchQuery,
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
            content="Upframe connects students with leaders in tech, design and product through 1-1 mentoring worldwide. Keep Pushing Forward."
          ></meta>
          <meta property="language" content="EN"></meta>
          <meta property="copyright" content="Upframe"></meta>
          <meta property="og:url" content={`${window.location.origin}`}></meta>
          <meta property="og:title" content="Upframe"></meta>
          <meta
            property="og:description"
            content="Upframe connects students with leaders in tech, design and product through 1-1 mentoring worldwide. Keep Pushing Forward."
          ></meta>
          <meta
            property="og:image"
            content={`${window.location.origin}/keep-pushing-forward.jpg`}
          ></meta>
          <meta property="og:site_name" content="Upframe"></meta>
          <meta name="twitter:card" content="summary_large_image"></meta>
        </Helmet>
        <Router>
          <div className="App">
            <AppContext.Provider value={contextValue}>
              <Navbar />
              <Suspense fallback={<div>Loading...</div>}>
                <Routes />
              </Suspense>
              <div id="snackbar">Information saved</div>
            </AppContext.Provider>
          </div>
        </Router>
      </>
    )
  }
}
