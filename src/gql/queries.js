import gql from 'graphql-tag'
import { person } from './fragments'

export const MENTORS = gql`
  query getMentors {
    mentors {
      ...MentorDetails
    }
  }
  ${person.mentorDetails}
`

export const PROFILE = gql`
  query MentorProfile($keycode: String!) {
    mentor(keycode: $keycode) @connection(key: $keycode) {
      ...MentorDetails
    }
  }
  ${person.mentorDetails}
`
