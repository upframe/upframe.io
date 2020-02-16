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
    onError(({ graphQLErrors, networkError, response }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path, extensions }) => {
          if (extensions.code === 'BAD_USER_INPUT') return notify(message)
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        })
      if (networkError) console.log(`[Network error]: ${networkError}`)
    }),
    new HttpLink({
      uri: 'http://localhost:5000',
      credentials: 'include',
    }),
  ]),
  cache: new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData,
    }),
    cacheRedirects: {
      Query: {
        mentor: (_, { keycode }, { getCacheKey }) =>
          getCacheKey({ __typename: 'Mentor', id: keycode }),
      },
    },
  }),
})

export function hasError(error, code) {
  if (!error || !code) return false
  return error.graphQLErrors.find(({ extensions }) => extensions.code === code)
}
