import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'

import SearchBar from '../MainSearchBar/MainSearchBar'
import AppContext from '../AppContext'
import {ProfilePicture} from '../index'

// import emojis and icons
import '../../icons.css'
import styles from './Navbar.module.scss'

export default class Navbar extends Component {
  static contextType = AppContext

  constructor(props) {
    super(props)

    this.state = {
      showMenu: false,
    }
  }

  openDropdown = e => {
    if (!this.state.showMenu) {
      e.target.focus()
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
      setTimeout(() => {
        this.setState({ showMenu: false })
      }, 200)
    }
  }

  resetSearch = () => {
    if (window.location.pathname === '/')
    window.location.reload()  
  }

  logout = () => {
    this.context.logout()
  }

  render() {
    let cx = classNames.bind(styles)
    const dropdown = cx(styles.dropdown, { ShowMenu: this.state.showMenu })
    const wrapper = cx(styles.wrapper,{ MentorPageNav: this.context.changeSearcBarhWidth})

    return (
      <header
        id={this.state.firstVisit ? 'with-notification' : null}
        className={this.state.cookieUpdated ? 'hide' : null}
      >
        <nav className={window.scrollY > 0 ? styles.scolling : null}>
          <div className={wrapper}>
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
                onClick={this.openDropdown}
                tabIndex="0"
              >
                <ProfilePicture
                  imgs={
                    this.context.user.pictures &&
                    Object.entries(this.context.user.pictures).length
                      ? this.context.user.pictures
                      : this.context.user.profilePic
                  }
                  className={styles.profilepic}
                  size="2rem"
                />
                <ul className={dropdown} tabIndex="1">
                  <Link to={'/' + this.context.user.keycode} tabIndex="0">
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
