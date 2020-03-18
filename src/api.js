import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import introspectionQueryResultData from './_fragmentTypes.json'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { notify } from './notification'

export default new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path, extensions }) => {
          if (extensions.code === 'BAD_USER_INPUT') return notify(message)
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        })
      if (networkError)
        notify('There seems to be a problem with your network connection')
    }),
    new HttpLink({
      uri: process.env.REACT_APP_GRAPHAPI,
      credentials: 'same-origin',
    }),
  ]),
  cache: new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData,
    }),
  }),
})

export function hasError(error, code) {
  if (!error || !code) return false
  return error.graphQLErrors.find(({ extensions }) => extensions.code === code)
}
