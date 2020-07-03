import { useState, useEffect, useReducer, useMemo } from 'react'
import Conversation from './conversation'
import Channel, { MsgQuery } from './channel'
import Message from './message'
import { useMe } from 'utils/hooks'
import * as gql from './gql'
import { useQuery, useSubscription } from 'gql'
import type { Conversations, MessageSub, MessageSubVariables } from 'gql/types'

export function useMessaging() {
  const { me } = useMe()

  useSubscription<MessageSub, MessageSubVariables>(gql.MSG_SUBSCRIPTION, {
    variables: { token: me?.msgToken as string },
    skip: !me?.msgToken,
    onSubscriptionData({ subscriptionData }) {
      const msg = subscriptionData?.data?.message
      if (!msg) return
      Channel.get(msg.channel).postMessage(Message.fromGqlMsg(msg))
    },
  })

  useQuery<Conversations>(gql.CONVERSATIONS, {
    skip: !me,
    onCompleted({ me }) {
      me?.conversations?.map(({ id, participants, channels }) =>
        Conversation.add(
          id,
          participants.map(({ id }) => id),
          channels.map(({ id }) => id)
        )
      )
    },
  })
}

export function useConversation(id: string) {
  const [conversation, setConversation] = useState<Conversation | null>()

  useEffect(() => {
    Conversation.get(id)
      .then(setConversation)
      .catch(() => setConversation(null))
  }, [id])

  return { conversation }
}

export function useConversations() {
  const [conversations, dispatch] = useReducer(
    (state, { type, value }) => (type === 'add' ? [...state, value] : state),
    []
  )

  useEffect(() => {
    Conversation.onStatic('added', value => {
      dispatch({ type: 'add', value })
    })
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
