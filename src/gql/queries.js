import gql from 'graphql-tag'
import { person } from './fragments'

export const MENTORS = gql`
  query MentorList {
    mentors {
      ...MentorDetails
    }
  }
  ${person.mentorDetails}
`

export const PROFILE = gql`
  query MentorProfile($keycode: String!) {
    mentor(keycode: $keycode) {
      ...MentorProfile
    }
  }
  ${person.mentorProfile}
`

export const ME = gql`
  query CurrentUser {
    me {
      ...PersonBase
    }
  }
  ${person.base}
`

export const SETTINGS_ACCOUNT = gql`
  query Account($keycode: String!) {
    mentor(keycode: $keycode) {
      _id
      email
      visibility
    }
  }
`
