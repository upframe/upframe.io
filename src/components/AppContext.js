import React from 'react'

export default React.createContext({
  loggedIn: false,
  user: {},
  test:false,
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
