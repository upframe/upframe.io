import gql from 'graphql-tag'
import { person } from './fragments'

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password }) {
      ...PersonBase
    }
  }
  ${person.base}
`

export const SIGN_OUT = gql`
  mutation SignOut {
    signOut
  }
`

export const SET_PROFILE_VISIBILITY = gql`
  mutation SetProfileVisibility($visibility: Visibility!) {
    setProfileVisibility(visibility: $visibility) {
      id
      visibility
    }
  }
`

export const REQUEST_EMAIL_CHANGE = gql`
  mutation RequestEmailChange {
    requestEmailChange
  }
`

export const REQUEST_PASSWORD_CHANGE = gql`
  mutation RequestPasswordChange {
    requestPasswordChange
  }
`

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($password: String!) {
    deleteAccount(password: $password)
  }
`

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($diff: ProfileInput!) {
    updateProfile(input: $diff) {
      ...MentorProfile
    }
  }
  ${person.mentorProfile}
`

export const UPDATE_NOTIICATION_PREFERENCES = gql`
  mutation UpdateNotificationSettings($diff: NotificationSettingsInput!) {
    updateNotificationPreferences(input: $diff) {
      ...PersonBase
      notificationPrefs {
        receiveEmails
        slotReminder
      }
    }
  }
  ${person.base}
`

export const UPDATE_SLOTS = gql`
  mutation UpdateSlots($added: [SlotInput!], $deleted: [ID!]) {
    updateSlots(slots: { added: $added, deleted: $deleted }) {
      id
      slots {
        id
        start
        duration
      }
    }
  }
`

export const SEND_MESSAGE_EXT = gql`
  mutation SendMessage(
    $to: ID!
    $name: String!
    $email: String!
    $msg: String!
  ) {
    messageExt(input: { to: $to, name: $name, email: $email, message: $msg })
  }
`

export const REQUEST_MEETUP = gql`
  mutation RequestMeetup(
    $slotId: ID!
    $name: String!
    $email: String!
    $msg: String!
  ) {
    requestSlot(
      input: { slotId: $slotId, name: $name, email: $email, message: $msg }
    )
  }
`

export const ACCEPT_MEETUP = gql`
  mutation AcceptMeetup($meetupId: ID!) {
    acceptMeetup(meetupId: $meetupId) {
      start
      location
      mentee {
        name
      }
    }
  }
`

export const CANCEL_MEETING = gql`
  mutation CancelMeetup($meetupId: ID!) {
    cancelMeetup(meetupId: $meetupId)
  }
`

export const CONNECT_CALENDAR = gql`
  mutation ConnectCalendar($code: ID!) {
    connectCalendar(code: $code)
  }
`