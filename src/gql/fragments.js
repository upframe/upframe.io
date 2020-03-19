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
        handle
        role
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
        tags
        ... on Mentor {
          title
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
        tags
      }
      ${this.mentorDetails}
    `
  },

  get profileSettings() {
    return gql`
      fragment ProfileSettings on Person {
        ...PersonBase
        website
        website
        biography
        location
        social(includeEmpty: true) {
          id
          name
          url
          handle
        }
        tags
        ... on Mentor {
          title
          company
        }
      }
      ${this.base}
    `
  },
}
