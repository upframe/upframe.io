const state: State = {
  users: {},
  conversations: [],
  meId: null,
  loggedIn: localStorage.getItem('loggedIn') === 'true',
}

export default state
