import { reducer } from '../actions'

export const meId = reducer('meId')<'SET_ME_ID'>((state, { type, value }) =>
  type === 'SET_ME_ID' ? value : state
)

export const loggedIn = reducer('loggedIn')<'TOGGLE_LOGGED_IN'>(
  (state, { type, value }) =>
    type === 'TOGGLE_LOGGED_IN' ? value ?? !state : state
)
