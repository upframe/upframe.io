import { useState, useEffect, useReducer, useMemo } from 'react'
import Conversation from './conversation'
import Channel, { MsgQuery } from './channel'
import Message from './message'
import { useMe } from 'utils/hooks'
import * as gql from './gql'
import { useQuery, useSubscription } from 'gql'
import api from 'api'
import type {
  Conversations,
  MessageSub,
  MessageSubVariables,
  ChannelSub,
  ChannelSubVariables,
  ConversationSub,
  ConversationSubVariables,
  ReadSubscription,
  ReadSubscriptionVariables,
  Participant,
  ParticipantVariables,
} from 'gql/types'

export function useMessaging() {
  const { me } = useMe()

  useSubscription<MessageSub, MessageSubVariables>(gql.MSG_SUBSCRIPTION, {
    variables: { token: me?.msgToken as string },
    skip: !me?.msgToken,
    onSubscriptionData({ subscriptionData }) {
      const msg = subscriptionData?.data?.message
      if (!msg) return
      Channel.get(msg.channel).postMessage(Message.fromGqlMsg(msg))
      if (msg.author !== me?.id)
        Channel.get(msg.channel).setReadStatus({ id: msg.id, read: false })
    },
  })

  useSubscription<ChannelSub, ChannelSubVariables>(gql.CHANNEL_SUBSCRIPTION, {
    variables: { token: me?.msgToken as string },
    skip: !me?.msgToken,
    onSubscriptionData({ subscriptionData }) {
      const channel = subscriptionData?.data?.channel
      if (!channel) return
      Conversation.get(channel.conversationId).then(con => {
        con.addChannel(Channel.get(channel.id))
      })
    },
  })

  useSubscription<ConversationSub, ConversationSubVariables>(
    gql.CONVERSATION_SUBSCRIPTION,
    {
      variables: { token: me?.msgToken as string },
      skip: !me?.msgToken,
      onSubscriptionData({ subscriptionData }) {
        const conversation = subscriptionData?.data?.conversation
        if (!conversation) return
        Conversation.get(conversation.id)
      },
    }
  )

  useSubscription<ReadSubscription, ReadSubscriptionVariables>(
    gql.READ_SUBSCRIPTION,
    {
      variables: { token: me?.msgToken as string },
      skip: !me?.msgToken,
      onSubscriptionData({ subscriptionData }) {
        const { userId, channelId, msgId } = subscriptionData?.data?.read ?? {}
        if (userId !== me?.id || !channelId || !msgId) return
        Channel.get(channelId).setReadStatus({ id: msgId, read: true })
      },
    }
  )

  useQuery<Conversations>(gql.CONVERSATIONS, {
    skip: !me,
    onCompleted({ me }) {
      me?.conversations?.map(({ id, participants, channels, lastUpdate }) =>
        Conversation.add(
          id,
          participants.map(({ id }) => id),
          new Date(lastUpdate ?? 0),
          channels.map(({ id }) => id)
        )
      )
      Conversation.initDone()
      me?.unread?.map(({ channelId, unread }) =>
        Channel.get(channelId)?.setReadStatus(
          ...unread.map(id => ({ id, read: false }))
        )
      )
    },
  })
}

export function useConversation(id: string) {
  const [conversation, setConversation] = useState<Conversation | null>()
  const [channels, setChannels] = useReducer(
    (
      state: Channel[],
      { type, channels = [] }: { type: 'add' | 'reset'; channels: Channel[] }
    ) =>
      type === 'reset'
        ? channels
        : [
            ...channels,
            ...state.filter(({ id }) => !channels.find(c => c.id === id)),
          ],
    []
  )

  useEffect(() => {
    Conversation.get(id)
      .then(setConversation)
      .catch(() => setConversation(null))
  }, [id])

  useEffect(() => {
    if (!conversation) return
    setChannels({ type: 'reset', channels: conversation.channels })
    return conversation.on('channel', c => {
      setChannels({ type: 'add', channels: [c] })
    })
  }, [conversation])

  return { conversation, channels }
}

export function useConversations() {
  const [conversations, dispatch] = useReducer(
    (state, { type, value }) =>
      type === 'add'
        ? [...state, ...(Array.isArray(value) ? value : [value])].sort(
            (a, b) => b.lastUpdate.getTime() - a.lastUpdate.getTime()
          )
        : [...state].sort(
            (a, b) => b.lastUpdate.getTime() - a.lastUpdate.getTime()
          ),
    []
  )

  useEffect(() => {
    dispatch({ type: 'add', value: Conversation.list })
    Conversation.onStatic('added', value => {
      dispatch({ type: 'add', value })
    })
    Conversation.onStatic('message', () =>
      dispatch({ type: 'sort', value: [] })
    )
  }, [])

  return conversations as Conversation[]
}

export function useChannel(id: string, ...msgQuery: MsgQuery[]) {
  const [channel, setChannel] = useState<Channel>()
  const [messages, setMessages] = useState<Message[]>([])
  const [fetching, setFetching] = useState(false)
  const { me } = useMe()
  const query = useMemo(
    () => msgQuery,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    msgQuery.flatMap(query => Object.entries(query).map(([k, v]) => k + v))
  )

  useEffect(() => {
    setChannel(Channel.get(id))
    setMessages([])
  }, [id])

  useEffect(() => {
    if (!channel || !query) return
    const fetch = () =>
      query.length === 1
        ? channel.messages(query[0]).then(setMessages)
        : channel.ranges(query).then(setMessages)

    fetch()

    return channel.on('message', fetch)
  }, [channel, query])

  useEffect(() => {
    if (!channel) return
    return channel.on('fetch', v => setFetching(v === 'start'))
  }, [channel])

  return {
    messages,
    fetching,
    sendMessage:
      channel &&
      me &&
      ((content: string) => channel.sendMessage(content, me.id)),
    channel,
  }
}

type User = Exclude<Participant['user'], null>
export function useParticipants(ids: string[]): User[] {
  const [participants, setParticipants] = useState<User[]>([])
  const { me } = useMe()

  const userIds = useMemo(
    () => ids?.filter(id => id !== me?.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...ids?.sort(), ...Array(100).fill(0)].slice(0, 100)
  )

  useEffect(() => {
    if (!userIds?.length) return
    Promise.all(
      userIds.map(id =>
        api.query<Participant, ParticipantVariables>({
          query: gql.PARTICIPANT,
          variables: { id },
        })
      )
    ).then(res =>
      setParticipants(
        res.flatMap(({ data }) => data?.user).filter(Boolean) as User[]
      )
    )
  }, [userIds])

  return participants
}
