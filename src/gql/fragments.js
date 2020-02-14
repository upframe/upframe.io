import gql from 'graphql-tag'

export default {
  landingPage: {
    mentor: gql`
      fragment LandingPageMentor on Mentor {
        name
        keycode
        role
        company
        bio
        profilePictures {
          size
          type
          url
        }
      }
    `,
  },
}
