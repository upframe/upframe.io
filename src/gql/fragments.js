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
        _id
        name
        ... on Mentor {
          keycode
          ...ProfilePictures
        }
      }
      ${this.profilePictures}
    `
  },

  get mentorDetails() {
    return gql`
      fragment MentorDetails on Mentor {
        ...PersonBase
        role
        company
        bio
      }
      ${this.base}
    `
  },
}
