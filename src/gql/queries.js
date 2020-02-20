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
  query MentorProfile($keycode: String!, $slotsAfter: String) {
    mentor(keycode: $keycode) {
      ...MentorProfile
      slots(after: $slotsAfter) {
        id
        start
      }
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
      id
      email
      visibility
    }
  }
`

export const SETTINGS_NOTIFICATIONS = gql`
  query Account($keycode: String!) {
    mentor(keycode: $keycode) {
      id
      notificationPrefs {
        receiveEmails
        slotReminder
      }
    }
  }
`

export const SLOTS = gql`
  query GetMentorSlots($keycode: String!) {
    mentor(keycode: $keycode) {
      id
      slots {
        id
        start
        duration
      }
    }
  }
`
