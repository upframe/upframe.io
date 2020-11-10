import { gql, fragments } from 'gql'

const SIGNUP_INFORMATION = gql`
  fragment SignUpInformation on SignUpInfo {
    signUpId: id
    email
    role
    authComplete
    signUpName: name
    picture {
      url
    }
    defaultPicture {
      url
    }
  }
`

export const SIGNUP_INFO = gql`
  query SignUpTokenInfo($token: ID!) {
    signUpInfo(token: $token) {
      ...SignUpInformation
    }
  }
  ${SIGNUP_INFORMATION}
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
      ... on SignUpInfo {
        ...SignUpInformation
      }
    }
  }
  ${fragments.person.base}
  ${SIGNUP_INFORMATION}
`

export const COMPLETE_SIGNUP = gql`
  mutation CompleteSignUp(
    $token: ID!
    $name: String!
    $handle: String!
    $biography: String!
    $location: String
    $headline: String
    $photo: String
    $tags: [String]
  ) {
    completeSignup(
      token: $token
      name: $name
      handle: $handle
      biography: $biography
      location: $location
      headline: $headline
      photo: $photo
      tags: $tags
    ) {
      ...PersonBase
      ... on Mentor {
        calendarConnected
        spaces {
          id
          handle
        }
      }
    }
  }
  ${fragments.person.base}
`
