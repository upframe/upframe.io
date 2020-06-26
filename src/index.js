import React from 'react'
import ReactDOM from 'react-dom'
import './styles/master.scss'
import './styles/variables.css'
import App from './App'
import { ApolloProvider } from '@apollo/client'
import client from './api'
import * as Sentry from '@sentry/browser'
import { Provider } from 'react-redux'
import { store } from './redux/store'

if (process.env.NODE_ENV !== 'development')
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
  })

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>,
  document.getElementById('root')
)
