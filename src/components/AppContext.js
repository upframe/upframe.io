import React from 'react'

export default React.createContext({
  loggedIn: false,
  user: {},
  setMentor: () => {},
  login: () => {},
  logout: () => {},
  saveUserInfo: () => {},
  setSearchQuery: () => {},
  setProfilePic: () => {},
  showToast: () => {},
  searchQuery: '',

  resetSearchQuery: false,
})
