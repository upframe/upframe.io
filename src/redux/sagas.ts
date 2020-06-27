import { takeEvery, select } from 'redux-saga/effects'
import { assemble } from './actions'

function* toggleLoggedIn(action: assemble<'TOGGLE_LOGGED_IN'>) {
  const loggedIn = yield select((state: State) => state.loggedIn)
  if (action.value.toString() !== loggedIn)
    localStorage.setItem('loggedIn', action.value.toString())
}

export default function*() {
  yield takeEvery('TOGGLE_LOGGED_IN', toggleLoggedIn)
}
