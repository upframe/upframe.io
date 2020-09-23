import gql from 'graphql-tag'
import { person } from './fragments'

export const MENTORS = gql`
  query Mentors {
    mentors {
      ...MentorDetails
      sortScore
    }
  }
  ${person.mentorDetails}
`

export const LIST = gql`
  query UserList($name: String!) {
    list(name: $name) {
      id
      name
      description
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
        user {
          ...MentorDetails
        }
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
  query MeId {
    me {
      id
      ...Timezone
      inferTz
    }
  }
  ${person.timezone}
`
export const ME = gql`
  query Me {
    me {
      ...MeBase
    }
  }
  ${person.meBase}
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
    user(id: $id) {
      ...NotificationSettings
    }
  }
  ${person.notificationSettings}
`

export const SETTINGS_CALENDAR = gql`
  query SettingsCalendar($id: ID!) {
    user(id: $id) {
      id
      email
      ... on Mentor {
        calendarConnected
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
        google {
          connected
          email
          canDisconnect
        }
      }
    }
  }
`

export const SLOTS = gql`
  query GetMentorSlots($id: ID!) {
    user(id: $id) {
      id
      ... on Mentor {
        slots {
          id
          start
          end
        }
      }
    }
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

export const CHECK_VALIDITY = gql`
  query CheckValidity(
    $name: String
    $handle: String
    $biography: String
    $location: String
    $headline: String
  ) {
    checkValidity(
      name: $name
      handle: $handle
      biography: $biography
      location: $location
      headline: $headline
    ) {
      field
      valid
      reason
    }
  }
`

export const LISTS = gql`
  query Lists {
    lists {
      id
      name
      illustration
      backgroundColor
      textColor
    }
  }
`

export const ALL_LIST_NAMES = gql`
  query AllLists {
    lists(includeUnlisted: true) {
      id
      name
    }
  }
`

export const USER_LIST_NAMES = gql`
  query UserListNames($ids: [ID!]!) {
    users(ids: $ids) {
      id
      name
      handle
    }
  }
`
