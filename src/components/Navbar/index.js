import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'

import SearchBar from '../MainSearchBar'
import AppContext from '../AppContext'

// import emojis and icons
import '../../icons.css'
import styles from './style.module.scss'

export default class Navbar extends Component {
  static contextType = AppContext

  constructor(props) {
    super(props)

    this.state = {
      scroll: false,
      mentors: [],
      showMenu: false,
    }
  }

  componentDidMount() {
    this.watchScroll()
  }

  watchScroll() {
    document.addEventListener('scroll', e => {
      if (window.scrollY > 0 && this.state.scroll === false)
        this.setState({ scroll: true })
      else this.setState({ scroll: false })
    })
  }

  openDropdown = e => {
    if (!this.state.showMenu) {
      return this.setState({
        showMenu: true,
      })
    }
    return this.setState({
      showMenu: false,
    })
  }

  handleClickOutside = () => {
    if (this.state.showMenu) {
      return this.setState({
        showMenu: false,
      })
    }
  }

  logout = () => {
    this.setState({
      showMenu: true,
    })
    this.context.logout()
  }

  resetSearch = () => {
    if (window.location.pathname === '/') this.context.setSearchQuery('', true)
  }

  render() {
    let cx = classNames.bind(styles)
    const dropdown = cx('dropdown', { ShowMenu: this.state.showMenu })

    return (
      <header
        id={this.state.firstVisit ? 'with-notification' : null}
        className={this.state.cookieUpdated ? 'hide' : null}
      >
        <nav className={window.scrollY > 0 ? styles.active : null}>
          <div className={styles.wrapper}>
            <div className={styles.SearchWrapper}>
              <Link to="/" id="logo" onClick={this.resetSearch}>
                <img src="/logo.svg" alt="Upframe logo" className="logo" />
              </Link>
              <SearchBar />
            </div>
            {this.context.loggedIn ? (
              <div
                className={styles.MenuWrapper}
                onBlur={this.handleClickOutside}
                tabIndex="0"
              >
                <img
                  id="profilepic"
                  className={styles.profilepic}
                  src={
                    this.context.user.profilePic !== ''
                      ? this.context.user.profilePic
                      : ''
                  }
                  alt="Profile pic"
                  onClick={this.openDropdown}
                />
                <ul className={dropdown}>
                  <Link to={'/' + this.context.user.keycode}>
                    <li>My Profile</li>
                  </Link>
                  <Link to="/settings/public" onClick={this.closeDropdown}>
                    <li>Settings</li>
                  </Link>
                  <Link to="#0">
                    <li onClick={this.logout}>Sign Out</li>
                  </Link>
                </ul>
              </div>
            ) : (
              <div className={styles.learnMoreWrapper}>
                <ul>
                  <li>
                    <a
                      className={styles.learnMore}
                      href="https://www.producthunt.com/upcoming/upframe"
                    >
                      Learn more
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </header>
    )
  }
}
