import React from 'react';

export default React.createContext({
  loggedIn: false,
  user: {},
  login: () => {},
  logout: () => {},
  saveUserInfo: () => {},
  setSearchQuery: () => {},
  setProfilePic: () => {},
  showToast: () => {},
  searchQuery: '',

  resetSearchQuery: false,
})