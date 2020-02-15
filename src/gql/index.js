import * as queries from './queries'
import * as mutations from './mutations'
import * as fragments from './fragments'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { hasError } from '../api'
import gql from 'graphql-tag'

export { queries, mutations, fragments, useQuery, useMutation, hasError, gql }
