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

    let firstVisit = docCookies.getItem('firstVisit')
    if (firstVisit && Number(firstVisit) === 0) firstVisit = false;
    else firstVisit = true;

    this.state = {
      firstVisit,
      cookieUpdated: false,
    }
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

  // Redefine cookie to hide notification and
  hideNotification = () => {
    docCookies.setItem('firstVisit', 0, Infinity, '/', '', false)
    
    this.setState({ cookieUpdated: true })
    setTimeout(() => {
      document.querySelector('header').id = ''
    }, 500)
  }

  render() {
    return (
      <header id={ this.state.firstVisit ? 'with-notification' : null }
        className={this.state.cookieUpdated ? 'hide' : null}>
        { this.state.firstVisit === true ?
          <div id='first-visit-notification' className='flex alignitems-center justifycontent-center'>
            {/* <span className='cupcake'></span> */}
            <p>Ahoy! Upframe is currently invite-only. Drop us some lines at
            team@upframe.io and we’ll keep you posted.</p>
            <span className='arrow' onClick={this.hideNotification}></span>  
          </div>
          : null
        }

        <nav>
          <div className='wrapper flex justifycontent-center alignitems-center'>
            <Link to='/' id='logo'>
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