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
          {this.context.user.keycode ?
            <Link to={'/' + this.context.user.keycode} id='logo'>
              <img src='/logo.svg' alt='Upframe logo' className='logo'></img>
            </Link> :
            <Link to='/' id='logo'>
              <img src='/logo.svg' alt='Upframe logo' className='logo'></img>
            </Link>
          }

          {this.context.loggedIn ?
            <div className='flex flex-column align-items-center dropdown'>
              <img id='profilepic' src={this.context.user.profilePic !== '' ? this.context.user.profilePic : '' } alt='Profile pic' onClick={this.openDropdown}></img>
              <ul>
                <li onClick={this.closeDropdown}><Link to='/settings' className='text-center'>Settings</Link></li>
                <li className='text-center' onClick={this.logout}>Logout</li>
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