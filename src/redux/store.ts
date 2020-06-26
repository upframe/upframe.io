import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import createSaga from 'redux-saga'
import * as reducers from './reducers'
import saga from './sagas'

const sagaMiddleware = createSaga()

export const store = createStore(
  combineReducers(reducers),
  compose(
    applyMiddleware(sagaMiddleware),
    ...('__REDUX_DEVTOOLS_EXTENSION__' in window
      ? [(window as any).__REDUX_DEVTOOLS_EXTENSION__()]
      : [])
  )
)

sagaMiddleware.run(saga)
