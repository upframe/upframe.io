import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import AppContext from './AppContext'

export default class Navbar extends Component {
  static contextType = AppContext

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

  render() {
    return (
      <nav>
        <div className='wrapper flex justify-center align-items-center'>
          <Link to='/' id='logo'>
            <img src='/logo.svg' alt='Upframe logo' className='logo'></img>
          </Link>

          {this.context.loggedIn ?
            <div className='flex flex-column align-items-center dropdown'>
              <img id='profilepic' src={this.context.user.profilePic !== '' ? this.context.user.profilePic : '' } alt='Profile pic' onClick={this.openDropdown}></img>
              <ul>
                <Link to={'/' + this.context.user.keycode} onClick={this.closeDropdown}><li>My Profile</li></Link>
                <Link to='/settings/public' onClick={this.closeDropdown}><li>Settings</li></Link>
                <li onClick={this.logout}><Link to='#0'>Sign Out</Link></li>
              </ul>
            </div>
          :
            null
            /*<div className='flex flex-column align-items-center'>
              <ul>
                {window.location.pathname === '/login' ? null : <li><Link to='/login'>Login</Link></li> }
              </ul>
            </div>*/
          }
        </div>
      </nav>
    )
  }
}