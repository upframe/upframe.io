import * as queries from './queries'
import * as mutations from './mutations'
import * as fragments from './fragments'
import {
  useQuery as _useQuery,
  useMutation,
  useSubscription,
} from '@apollo/client'
import client, { hasError } from 'api'
import gql from 'graphql-tag'

const useQuery = (query, { onCompleted: _onCompleted, ...opts } = {}) => {
  const { networkStatus, ...rest } = _useQuery(query, {
    ...opts,
    ...(_onCompleted && {
      onCompleted(result) {
        if (networkStatus) _onCompleted(result)
      },
    }),
  })
  return { networkStatus, ...rest }
}

export {
  queries,
  mutations,
  fragments,
  useQuery,
  useMutation,
  useSubscription,
  hasError,
  gql,
  client,
}
