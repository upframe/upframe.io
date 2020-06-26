import defaultState from '../defaultState'
import { assemble as a } from '../actions'

export default function(
  state = defaultState.users,
  action: a<'ADD_USER'>
): State['users'] {
  switch (action.type) {
    case 'ADD_USER':
      return {
        ...state,
        [action.value.id]: action.value,
      }
    default:
      return state
  }
}
