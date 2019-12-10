import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from '../Navbar'
import AppContext from '../../AppContext'
import { changeExt } from 'upath'
import styles from '../Navbar.module.scss'

afterEach(cleanup)

const renderContext = (
  mockChangeSearchWidth,
  mockLoggedIn,
  mockSetProfilePic,
  mockLoggedOut
) => {
  return render(
    <Router>
      <AppContext.Provider
        value={{
          changeSearcBarhWidth: mockChangeSearchWidth,
          loggedIn: mockLoggedIn,
          user: mockSetProfilePic,
          logout: mockLoggedOut,
        }}
      >
        <Navbar />
      </AppContext.Provider>
    </Router>
  )
}

const mockSetProfilePic = jest.fn(url => 'test')
const mockChangeSearchWidth = jest.fn(changeSearcBarhWidth => false)
const mockLoggedIn = jest.fn(loggedIn => true)
const mockLoggedOut = jest.fn(loggedIn => false)

describe('testing if component renderd', () => {
  it('testing if component is renderd', () => {
    const { getByText } = render(
      <Router>
        <Navbar />{' '}
      </Router>
    )
    const btnText = getByText('Learn more')
    expect(btnText).toBeTruthy()
  })
})

describe('testing user logged state', () => {
  it('test if user can see profile picture when he is logged in', () => {
    const { getByAltText } = renderContext(
      mockChangeSearchWidth,
      mockLoggedIn,
      mockSetProfilePic
    )
    const picAltText = getByAltText('profile picture')
    expect(picAltText).toBeTruthy()
  })

  it('test if user can log out', () => {
    const { getByAltText, getByText } = renderContext(
      mockChangeSearchWidth,
      mockLoggedIn,
      mockSetProfilePic,
      mockLoggedOut
    )
    const picAltText = getByAltText('profile picture')
    const loggedOutText = getByText('Sign Out')
    fireEvent.click(picAltText)
    fireEvent.click(loggedOutText)
    expect(mockLoggedOut.mock.calls.length).toBe(1)
  })
})

describe('testing drop down', () => {
  it('component is renderd', () => {
    const { getByText } = render(
      <Router>
        <Navbar />{' '}
      </Router>
    )
    const btnText = getByText('Learn more')
    expect(btnText).toBeTruthy()
  })

  it('test if user can see profile picture when he is logged in', () => {
    const { getByAltText } = renderContext(
      mockChangeSearchWidth,
      mockLoggedIn,
      mockSetProfilePic
    )
    const picAltText = getByAltText('profile picture')
    expect(picAltText).toBeTruthy()
  })

  it('dropdown menu is opening when clicking', () => {
    const { getByAltText } = renderContext(
      mockChangeSearchWidth,
      mockLoggedIn,
      mockSetProfilePic
    )
    const picAltText = getByAltText('profile picture')
    fireEvent.click(picAltText)
    const getDropDown = document.getElementsByClassName(styles.showMenu)[0]
    expect(getDropDown).toBeTruthy()
  })

  it('dropdown is closing ', () => {
    const { getByAltText, getByPlaceholderText } = renderContext(
      mockChangeSearchWidth,
      mockLoggedIn,
      mockSetProfilePic
    )
    const picAltText = getByAltText('profile picture')
    fireEvent.click(picAltText)
    fireEvent.click(picAltText)
    const getDropDown = document.getElementsByClassName(styles.showMenu)[0]
    expect(getDropDown).toBeFalsy()
  })
})
