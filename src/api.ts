import { ApolloClient } from '@apollo/client'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink, split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import introspectionQueryResultData from './_fragmentTypes.json'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { notify } from './notification'

const httpLink = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path, extensions }) => {
        if (['BAD_USER_INPUT', 'FORBIDDEN'].includes(extensions?.code))
          return notify(message)
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      })
    if (networkError)
      notify('There seems to be a problem with your network connection')
  }),
  new HttpLink({
    uri: process.env.REACT_APP_GRAPHAPI,
    credentials: 'include',
  }),
])

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_WS_HOST as string,
  options: {
    reconnect: true,
  },
})

const api = new ApolloClient({
  link: split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink
  ) as any,
  cache: new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData,
    }),
    dataIdFromObject: object => {
      if (object.__typename === 'SocialHandle') return null
      return object.__typename && object.id
        ? `${object.__typename}|${object.id}`
        : null
    },
    cacheRedirects: {
      Query: {
        user: (_, { id }, { getCacheKey }) => {
          const entry = api.cache.data.data[id]
          if (entry) return getCacheKey(entry)
        },
      },
    },
  }) as any,
})
export default api as ApolloClient<any>

export function hasError(error, code) {
  if (!error || !code) return false
  return error.graphQLErrors.find(({ extensions }) => extensions.code === code)
}
