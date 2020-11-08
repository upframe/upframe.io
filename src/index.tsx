import React from 'react'
import ReactDOM from 'react-dom'
import './styles/master.scss'
import './styles/variables.css'
import './styles/layout.css'
import App from './App'
import { ApolloProvider } from '@apollo/client'
import client from './api'
import * as Sentry from '@sentry/browser'
import { Router } from 'react-router-dom'
import history from 'utils/history'

if (process.env.NODE_ENV !== 'development')
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
  })

if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js')

ReactDOM.render(
  <Router history={history}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Router>,
  document.getElementById('root')
)
