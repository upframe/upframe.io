import { gql } from '../gql'

export const CONVERSATION = gql`
  fragment ConversationBase on Conversation {
    id
    participants {
      id
    }
    channels {
      id
    }
  }
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
    }
  }
  ${CONVERSATION}
`

export const MSG_SUBSCRIPTION = gql`
  subscription MessageSub($token: ID!) {
    message(token: $token) {
      id
      content
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

export const CONVERSATIONS = gql`
  query Conversations {
    me {
      id
      conversations {
        id
        participants {
          id
        }
        channels {
          id
        }
      }
      unread {
        channelId
        unread
      }
    }
  }
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
            content
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
      content
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
            content
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
