import React from 'react'
import ReactDOM from 'react-dom'
import './styles/master.scss'
import './styles/variables.css'
import App from './App'
import { ApolloProvider } from '@apollo/react-hooks'
import client from './api'

import mixpanel from 'mixpanel-browser'

mixpanel.init('993a3d7a78434079b7a9bec245dbaec2')

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
