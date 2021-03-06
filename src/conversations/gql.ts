import { gql } from '../gql'
import { person } from 'gql/fragments'

export const CONVERSATION = gql`
  fragment ConversationBase on Conversation {
    id
    lastUpdate
    participants {
      id
    }
    channels {
      id
    }
  }
`

export const CHAT_PARTICIPANT = gql`
  fragment ChatParticipant on Person {
    ...PersonBase
    timezone {
      utcOffset
      informal {
        current {
          name
        }
      }
    }
  }
  ${person.base}
`

export const FETCH_CONVERSATION = gql`
  query FetchConversation($id: ID!) {
    conversation(conversationId: $id) {
      ...ConversationBase
    }
  }
  ${CONVERSATION}
`

export const CREATE_CONVERSATION = gql`
  mutation CreateConversation($participants: [ID!]!, $msg: String) {
    createConversation(participants: $participants, msg: $msg) {
      ...ConversationBase
      participants {
        ...ChatParticipant
      }
    }
  }
  ${CONVERSATION}
  ${CHAT_PARTICIPANT}
`

export const MSG_SUBSCRIPTION = gql`
  subscription MessageSub($token: ID!) {
    message(token: $token) {
      id
      content(fallback: true)
      markup
      author
      time
      channel
    }
  }
`

export const CHANNEL_SUBSCRIPTION = gql`
  subscription ChannelSub($token: ID!) {
    channel(token: $token) {
      id
      conversationId
    }
  }
`

export const CONVERSATION_SUBSCRIPTION = gql`
  subscription ConversationSub($token: ID!) {
    conversation(token: $token) {
      id
    }
  }
`

export const READ_SUBSCRIPTION = gql`
  subscription ReadSubscription($token: ID!) {
    read(token: $token) {
      userId
      channelId
      msgId
    }
  }
`

export const CONVERSATIONS = gql`
  query Conversations {
    me {
      id
      conversations {
        ...ConversationBase
        participants {
          ...ChatParticipant
        }
      }
      unread {
        channelId
        unread
      }
    }
  }
  ${CONVERSATION}
  ${CHAT_PARTICIPANT}
`

export const CHANNEL_MSGS = gql`
  query ChannelMsgs(
    $id: ID!
    $last: Int
    $before: ID
    $first: Int
    $after: ID
  ) {
    channel(channelId: $id) {
      id
      messages(last: $last, before: $before, first: $first, after: $after) {
        edges {
          cursor
          node {
            id
            author
            content(fallback: true)
            markup
            time
          }
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
        }
      }
    }
  }
`

export const SEND_MESSAGE = gql`
  mutation SendChatMessage($channel: ID!, $content: String!) {
    sendMessage(channel: $channel, content: $content) {
      id
      content(fallback: true)
      markup
      time
      author
    }
  }
`

export const CREATE_CHANNEL = gql`
  mutation CreateChannel($conversationId: ID!, $msg: String) {
    createThread(conversationId: $conversationId, msg: $msg) {
      id
      messages {
        edges {
          node {
            id
            content(fallback: true)
            markup
            author
            time
          }
        }
      }
    }
  }
`

export const MARK_READ = gql`
  mutation MarkRead($input: [MarkReadInput!]!) {
    markRead(input: $input)
  }
`

export const PARTICIPANT = gql`
  query Participant($id: ID!) {
    user(id: $id) @client {
      ...ChatParticipant
    }
  }
  ${CHAT_PARTICIPANT}
`

export const FETCH_PARTICIPANT = gql`
  query FetchParticipant($id: ID!) {
    user(id: $id) {
      ...ChatParticipant
    }
  }
  ${CHAT_PARTICIPANT}
`
