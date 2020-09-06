import React from 'react'
import ReactDOM from 'react-dom'
import './styles/master.scss'
import './styles/variables.css'
import './styles/layout.css'
import App from './App'
import { ApolloProvider } from '@apollo/client'
import client from './api'
import * as Sentry from '@sentry/browser'

if (process.env.NODE_ENV !== 'development')
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
  })

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(
      ({ scope }) => console.log('sw registered with scope:', scope),
      err => console.log('sw registration failed:', err)
    )
  })
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
