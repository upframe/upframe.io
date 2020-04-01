import React from 'react'
import ReactDOM from 'react-dom'
import './styles/master.scss'
import './styles/variables.css'
import App from './App'
import { ApolloProvider } from '@apollo/react-hooks'
import client from './api'

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
