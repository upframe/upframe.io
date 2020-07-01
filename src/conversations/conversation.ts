import api from 'api'
import type {
  FetchConversation,
  FetchConversationVariables,
  CreateConversation,
  CreateConversationVariables,
} from 'gql/types'
import * as gql from './gql'
import Channel from './channel'

export default class Conversation {
  private static instances: { [id: string]: Conversation } = {}
  private static eventHandlers: {
    [event in ConversationEvent]: ConversationEventHandler[]
  } = {
    added: [],
  }
  public channels: Channel[] = []

  protected constructor(
    public readonly id: string,
    public readonly participants: string[],
    channels: string[] = []
  ) {
    Conversation.instances[id] = this
    Conversation.eventHandlers.added?.forEach(handler => handler(this))
    channels.forEach(id => this.channels.push(Channel.get(id)))
  }

  public static async get(id: string): Promise<Conversation> {
    return id in Conversation.instances
      ? Conversation.instances[id]
      : await Conversation.fetch(id)
  }
  public static add(
    id: string,
    participants: string[],
    channels?: string[]
  ): Conversation {
    if (id in Conversation.instances) return Conversation.instances[id]
    return new Conversation(id, participants, channels)
  }

  public static async create(participants: string[], firstMsg?: string) {
    const { data, errors } = await api.mutate<
      CreateConversation,
      CreateConversationVariables
    >({
      mutation: gql.CREATE_CONVERSATION,
      variables: { participants, msg: firstMsg },
    })
    const con = data?.createConversation
    if (!con) throw errors?.[0] ?? Error("couldn't create conversation")
    return new Conversation(
      con.id,
      con.participants.map(({ id }) => id)
    )
  }

  private static async fetch(id: string): Promise<Conversation> {
    const { data } = await api.query<
      FetchConversation,
      FetchConversationVariables
    >({
      query: gql.FETCH_CONVERSATION,
      variables: { id },
    })
    if (!data?.conversation)
      throw Error(`conversation with id ${id} doesn't exist`)
    return new Conversation(
      data.conversation.id,
      data.conversation.participants.map(({ id }) => id),
      data.conversation.channels.map(({ id }) => id)
    )
  }

  public static get list(): Conversation[] {
    return Object.values(Conversation.instances)
  }

  public static on(
    event: ConversationEvent,
    handler: ConversationEventHandler
  ) {
    Conversation.eventHandlers[event].push(handler)
    return () => Conversation.eventHandlers[event].filter(v => v !== handler)
  }
}

type ConversationEvent = 'added'
type ConversationEventHandler = (v: Conversation) => any
