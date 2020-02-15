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
      ...MentorDetails
    }
  }
  ${person.mentorDetails}
`

export const ME = gql`
  query CurrentUser {
    me {
      ...PersonBase
    }
  }
  ${person.base}
`
