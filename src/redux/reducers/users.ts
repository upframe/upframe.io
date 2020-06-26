import { reducer } from '../actions'

export default reducer('users')<'ADD_USER'>((state, { type, value }) => {
  switch (type) {
    case 'ADD_USER':
      return { ...state, [value.id]: value }
    default:
      return state
  }
})
