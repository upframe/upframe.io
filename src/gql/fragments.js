import gql from 'graphql-tag'

export const person = {
  get profilePictures() {
    return gql`
      fragment ProfilePictures on Person {
        profilePictures {
          size
          type
          url
        }
      }
    `
  },

  get base() {
    return gql`
      fragment PersonBase on Person {
        id
        name
        displayName
        handle
        role
        headline
        ...ProfilePictures
      }
      ${this.profilePictures}
    `
  },

  get mentorDetails() {
    return gql`
      fragment MentorDetails on Person {
        ...PersonBase
        biography
        tags {
          id
          name
        }
        headline
        ... on Mentor {
          company
        }
      }
      ${this.base}
    `
  },

  get mentorProfile() {
    return gql`
      fragment MentorProfile on Person {
        ...MentorDetails
        location
        website
        social {
          id
          name
          url
          handle
        }
        tags {
          id
          name
        }
      }
      ${this.mentorDetails}
    `
  },

  get profileSettings() {
    return gql`
      fragment ProfileSettings on Person {
        ...PersonBase
        website
        biography
        location
        social(includeEmpty: true) {
          id
          name
          url
          handle
        }
        tags {
          id
          name
        }
        headline
        ... on Mentor {
          company
        }
        ...Timezone
        inferTz
      }
      ${this.base}
      ${this.timezone}
    `
  },

  get notificationSettings() {
    return gql`
      fragment NotificationSettings on Person {
        ...PersonBase
        ... on Person {
          notificationPrefs {
            receiveEmails
            msgEmails
          }
        }
        ... on Mentor {
          notificationPrefs {
            receiveEmails
            msgEmails
            slotReminder
          }
        }
      }
      ${this.base}
    `
  },

  get invites() {
    return gql`
      fragment Invites on Person {
        invites {
          email
          role
          status
        }
      }
    `
  },

  get timezone() {
    return gql`
      fragment Timezone on Person {
        timezone {
          iana
          utcOffset
          nonDstOff
          informal {
            current {
              name
              abbr
            }
          }
          hasDst
          isDst
        }
      }
    `
  },

  get meBase() {
    return gql`
      fragment MeBase on Person {
        ...PersonBase
        role
        email
        searchable
        ... on Mentor {
          calendarConnected
          visibility
        }
        ...Timezone
        inferTz
        msgToken
        spaces {
          id
          name
          handle
        }
      }
      ${person.base}
      ${person.timezone}
    `
  },
}
