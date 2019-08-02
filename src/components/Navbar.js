import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import AppContext from './AppContext'

import { docCookies } from '../utils/Cookies'

// import emojis and icons
import '../icons.css'

export default class Navbar extends Component {
  static contextType = AppContext

  constructor(props) {
    super(props);

    this.state = {
      scroll: false,
    }
  }

  componentDidMount() {
    this.watchScroll()
  }

  watchScroll() {
    document.addEventListener('scroll', (e) => {
      if (window.scrollY > 0 && this.state.scroll === false) this.setState({ scroll: true })
      else this.setState({ scroll: false })
    })
  }

  openDropdown = () => {
    let dropdown = document.querySelector('nav div.dropdown')
    dropdown.classList.add('active')
    document.addEventListener("click", this.closeDropdown)
  }

  closeDropdown = () => {
    let dropdown = document.querySelector('nav div.dropdown')
    dropdown.classList.remove('active')
    document.removeEventListener("click", this.closeDropdown)
  }

  logout = () => {
    this.closeDropdown()
    this.context.logout()
  }

  resetSearch = () => {
    if (window.location.pathname === '/') this.context.setSearchQuery('', true)
  }

  render() {
    return (
      <header id={ this.state.firstVisit ? 'with-notification' : null }
        className={this.state.cookieUpdated ? 'hide' : null}>
        <nav className={window.scrollY > 0 ? 'active' : null}>
          <div className='wrapper flex justifycontent-center alignitems-center'>
            <Link to='/' id='logo' onClick={this.resetSearch}>
              <img src='/logo.svg' alt='Upframe logo' className='logo'></img>
            </Link>

            {this.context.loggedIn ?
              <div className='flex flex-column alignitems-center dropdown'>
                <img id='profilepic' src={this.context.user.profilePic !== '' ? this.context.user.profilePic : '' } alt='Profile pic' onClick={this.openDropdown}></img>
                <ul>
                  <Link to={'/' + this.context.user.keycode} onClick={this.closeDropdown}><li>My Profile</li></Link>
                  <Link to='/settings/public' onClick={this.closeDropdown}><li>Settings</li></Link>
                  <li onClick={this.logout}><Link to='#0'>Sign Out</Link></li>
                </ul>
              </div>
            :
              <div className='flex flex-column alignitems-center'>
                <ul>
                  {window.location.pathname === '/login' ? null : <li><Link to='/login'>Login</Link></li> }
                </ul>
              </div>
            }
          </div>
        </nav>
      </header>
    )
  }
}