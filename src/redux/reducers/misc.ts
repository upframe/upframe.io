import { reducer } from '../actions'

export const meId = reducer('meId')<'SET_ME_ID'>((state, { type, value }) =>
  type === 'SET_ME_ID' ? value : state
)
