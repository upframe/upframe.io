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
  mutation SetProfileVisibility($visibility: Visibility) {
    setProfileVisibility(visibility: $visibility) {
      _id
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
  mutation UpdateProfile($diff: ProfileInput) {
    updateProfile(input: $diff) {
      ...MentorProfile
    }
  }
  ${person.mentorProfile}
`

export const UPDATE_NOTIICATION_PREFERENCES = gql`
  mutation updateNotificationSettings($diff: NotificationSettingsInput) {
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
  mutation updateSlots($added: [SlotInput!], $deleted: [ID!]) {
    updateSlots(slots: { added: $added, deleted: $deleted }) {
      _id
      slots {
        id
        start
        duration
      }
    }
  }
`
