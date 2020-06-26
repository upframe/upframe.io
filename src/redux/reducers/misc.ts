import defaultState from '../defaultState'
import { assemble as a } from '../actions'

export const meId = (state = defaultState.meId, action: a<'SET_ME_ID'>) =>
  action.type === 'SET_ME_ID' ? action.value : state
