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

export const SETTINGS_PROFILE = gql`
  query SettingsProfile($id: ID!) {
    mentor(id: $id) {
      ...MentorProfile
    }
  }
  ${person.mentorProfile}
`

export const SETTINGS_ACCOUNT = gql`
  query SettingsAccount($id: ID!) {
    mentor(id: $id) {
      id
      email
      visibility
    }
  }
`

export const SETTINGS_NOTIFICATIONS = gql`
  query SettingsNotifications($id: ID!) {
    mentor(id: $id) {
      id
      notificationPrefs {
        receiveEmails
        slotReminder
      }
    }
  }
`

export const SLOTS = gql`
  query GetMentorSlots($id: ID!) {
    mentor(id: $id) {
      id
      slots {
        id
        start
        duration
      }
    }
  }
`

export const CONNECT_CALENDAR_URL = gql`
  query GetCalendarConnectUrl {
    calendarConnectUrl
  }
`
