import { gql, fragments } from 'gql'

export const MEMBER_QUERY = gql`
  query SpaceMembers($spaceId: ID!) {
    space(id: $spaceId) {
      id
      owners {
        ...SpaceMember
      }
      mentors(includeOwners: false) {
        ...SpaceMember
      }
      members(includeOwners: false) {
        ...SpaceMember
      }
    }
  }

  fragment SpaceMember on Person {
    id
    name
    handle
    headline
    ...ProfilePictures
  }

  ${fragments.person.profilePictures}
`

export const MEMBER_INFO = gql`
  query MemberInfo($spaceId: ID!, $userId: ID!) {
    space(id: $spaceId) {
      id
      isMentor(user: $userId)
      isOwner(user: $userId)
    }
  }
`

export const REMOVE_MEMBER = gql`
  mutation RemoveMember($spaceId: ID!, $userId: ID!) {
    removeFromSpace(space: $spaceId, user: $userId)
  }
`

export const CHANGE_ROLE = gql`
  mutation ChangeMemberRole(
    $space: ID!
    $user: ID!
    $mentor: Boolean
    $owner: Boolean
  ) {
    changeMemberRole(space: $space, user: $user, mentor: $mentor, owner: $owner)
  }
`
