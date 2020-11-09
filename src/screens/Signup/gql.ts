import { gql, fragments } from 'gql'

export const SIGNUP_INFO = gql`
  query SignUpTokenInfo($token: ID!) {
    signUpInfo(token: $token) {
      id
      email
      role
      authComplete
      name
      picture {
        url
      }
      defaultPicture {
        url
      }
    }
  }
`

export const SIGNUP = gql`
  mutation SignUp(
    $token: ID!
    $passwordInput: PasswordLoginInput
    $googleInput: GoogleLoginInput
  ) {
    signUp(
      token: $token
      passwordInput: $passwordInput
      googleInput: $googleInput
    ) {
      ... on Person {
        ...PersonBase
      }
      ... on Mentor {
        calendarConnected
      }
    }
  }
  ${fragments.person.base}
`
