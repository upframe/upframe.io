import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import * as Api from '../utils/Api'

export default class Navbar extends Component {
  constructor() {
    super()

    this.state = {
      profilePicSrc: ''
    }
    this.loadProfile()
  }

  async loadProfile() {
    let user = await Api.getUserInfo()
    if(user.code === 200) {
      let picURL = user.user.profilePic
      let newState = {
        profilePicSrc: picURL
      }

      this.setState(newState)
    }
  }

  toggleDropdown = () => {
    let dropdown = document.querySelector('nav div.dropdown')

    if (dropdown.classList.contains('active')) {
      dropdown.classList.remove('active')
    } else {
      dropdown.classList.add('active')
    }
  }

  logout = () => {
    Api.logout()
    this.props.setLoggedInState(false)
  }

  render() {
    return (
      <nav>
        <div className='wrapper flex justify-center align-items-center'>
          <Link to='/' id='logo'>
            <img src='/logo.svg' alt='' className='logo'></img>
          </Link>

          {this.props.loggedIn ?
            <div className='flex flex-column align-items-center dropdown'>
              <img id='profilepic' src={this.state.profilePicSrc !== '' ? this.state.profilePicSrc : '' } alt='Profile pic' onClick={this.toggleDropdown}></img>
              <ul>
                <li><Link to='/settings' className='text-center'>Settings</Link></li>
                <li className='text-center' onClick={this.logout}>Logout</li>
              </ul>
            </div>
          :
            <div className='flex flex-column align-items-center'>
              <ul>
                {window.location.pathname === '/login' ? null : <li><Link to='/login'>Login</Link></li> }
              </ul>
            </div>
          }
        </div>
      </nav>
    )
  }
}