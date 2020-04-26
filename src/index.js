import React from 'react'
import ReactDOM from 'react-dom'
import './styles/master.scss'
import './styles/variables.css'
import App from './App'
import { ApolloProvider } from '@apollo/react-hooks'
import client from './api'
import * as Sentry from '@sentry/browser'

if (process.env.NODE_ENV !== 'development')
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
  })

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
