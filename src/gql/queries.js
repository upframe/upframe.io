import gql from 'graphql-tag'
import { person } from './fragments'

export const MENTORS = gql`
  query Mentors {
    mentors {
      ...MentorDetails
      categories
    }
  }
  ${person.mentorDetails}
`

export const LIST = gql`
  query UserList($name: String!) {
    list(name: $name) {
      name
      users {
        ...MentorDetails
      }
    }
  }
  ${person.mentorDetails}
`

export const TAG = gql`
  query TagList($name: String!) {
    tag(name: $name) {
      name
      users {
        ...MentorDetails
      }
    }
  }
  ${person.mentorDetails}
`

export const SEARCH = gql`
  query SearchList($query: String, $tags: [String!]) {
    search(term: $query, withTagNames: $tags) {
      users {
        ...MentorDetails
      }
    }
  }
  ${person.mentorDetails}
`

export const PROFILE = gql`
  query MentorProfile($handle: String!, $slotsAfter: String) {
    user(handle: $handle) {
      ...MentorProfile
      ... on Mentor {
        slots(after: $slotsAfter) {
          id
          start
        }
      }
    }
  }
  ${person.mentorProfile}
`

export const ME_ID = gql`
  query CurrentUser {
    me {
      id
    }
  }
`
export const ME = gql`
  query CurrentUser2($id: ID) {
    user(id: $id) {
      ...PersonBase
      role
      email
      ... on Mentor {
        calendarConnected
        visibility
      }
    }
  }
  ${person.base}
`

export const SETTINGS_PROFILE = gql`
  query SettingsProfile($id: ID!) {
    user(id: $id) {
      ...ProfileSettings
    }
  }
  ${person.profileSettings}
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
      slots(includeBooked: true) {
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
  query GoogleCalendarEvents($calendarIds: [ID!]!, $id: ID) {
    user(id: $id) {
      id
      ... on Mentor {
        calendars(ids: $calendarIds) {
          id
          name
          events(max: 100) {
            id
            name
            start
            end
          }
        }
      }
    }
  }
`

export const VERIFY_TOKEN = gql`
  query VerifyToken($token: String!) {
    isTokenValid(token: $token)
  }
`

export const SIGNUP_INFO = gql`
  query SignUpInfo($token: ID!) {
    signUpInfo(token: $token) {
      email
      role
    }
  }
`
