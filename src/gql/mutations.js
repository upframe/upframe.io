import gql from 'graphql-tag'
import { person } from './fragments'

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password }) {
      ...PersonBase
    }
  }
  ${person.base}
`
