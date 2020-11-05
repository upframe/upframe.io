import { gql, fragments } from 'gql'

export const SPACE_QUERY = gql`
  query SpacePage($handle: String!) {
    space(handle: $handle) {
      id
      isMember
      isOwner
      name
      handle
      description
      sidebar
      mentors {
        ...MentorDetails
        sortScore
      }
      owners {
        id
        handle
        ...ProfilePictures
      }
      members(includeOwners: false) {
        id
        handle
        ...ProfilePictures
      }
      photo {
        ...Img
      }
      cover {
        ...Img
      }
    }
  }
  ${fragments.person.mentorDetails}
  ${fragments.person.profilePictures}
  ${fragments.Img}
`

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
      invited {
        email
        issued
        role
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

export const INVITE_QUERY = gql`
  query SpaceInviteInfo($token: ID!) {
    spaceInvite(token: $token) {
      name
      handle
      isMember
    }
  }
`

export const JOIN_SPACE = gql`
  mutation AcceptSpaceInvite($token: ID!) {
    joinSpace(token: $token) {
      handle
    }
  }
`

export const SPACE_INFO = gql`
  fragment SpaceInfo on Space {
    id
    name
    description
    handle
    sidebar
  }
`

export const SETTINGS_QUERY = gql`
  query SpaceSettings($spaceId: ID!) {
    space(id: $spaceId) {
      ...SpaceInfo
    }
  }
  ${SPACE_INFO}
`

export const CHANGE_INFO = gql`
  mutation ChangeSpaceInfo($input: SpaceInfoInput!) {
    changeSpaceInfo(input: $input) {
      ...SpaceInfo
    }
  }
  ${SPACE_INFO}
`

export const INVITE_LINKS = gql`
  query SpaceInviteLinks($space: ID!) {
    space(id: $space) {
      id
      inviteLinks {
        founder
        mentor
        owner
      }
    }
  }
`

export const CREATE_INVITE = gql`
  mutation CreateSpaceInvite($role: SpaceInviteRole!, $space: ID!) {
    createSpaceInvite(role: $role, space: $space)
  }
`

export const REVOKE_INVITE = gql`
  mutation RevokeSpacInvite($role: SpaceInviteRole!, $space: ID!) {
    revokeSpaceInvite(role: $role, space: $space)
  }
`

export const INVITE_EMAILS = gql`
  mutation InviteToSpace(
    $space: ID!
    $emails: [String!]!
    $role: SpaceInviteRole!
  ) {
    inviteToSpace(emails: $emails, role: $role, space: $space)
  }
`
