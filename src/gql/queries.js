import gql from 'graphql-tag'
import { person } from './fragments'

export const MENTORS = gql`
  query MentorList {
    mentors {
      ...MentorDetails
      categories
    }
  }
  ${person.mentorDetails}
`

export const PROFILE = gql`
  query MentorProfile($handle: String!, $slotsAfter: String) {
    mentor(handle: $handle) {
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
      ... on Mentor {
        calendarConnected
      }
    }
  }
  ${person.base}
`

export const SETTINGS_PROFILE = gql`
  query SettingsProfile($id: ID!) {
    mentor(id: $id) {
      ...ProfileSettings
    }
  }
  ${person.profileSettings}
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

export const SETTINGS_CALENDAR = gql`
  query SettingsCalendar($id: ID!) {
    mentor(id: $id) {
      id
      calendarConnected
      email
      slots {
        id
        start
        end
      }
      calendars {
        id
        name
        color
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
        end
      }
    }
  }
`

export const CONNECT_CALENDAR_URL = gql`
  query GetCalendarConnectUrl {
    calendarConnectUrl
  }
`

export const GCAL_EVENTS = gql`
  query GoogleCalendarEvents($calendarIds: [ID!]!) {
    me {
      id
      ... on Mentor {
        calendars(ids: $calendarIds) {
          id
          name
          events {
            id
            start
            end
          }
        }
      }
    }
  }
`
