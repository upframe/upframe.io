import api from 'api'
import type {
  FetchConversation,
  FetchConversationVariables,
  CreateConversation,
  CreateConversationVariables,
} from 'gql/types'
import * as gql from './gql'
import Channel from './channel'
import Message from './message'

export default class Conversation {
  private static instances: { [id: string]: Conversation } = {}
  private static staticEventHandlers: {
    [event in StaticEvent]: StaticEventHandler[]
  } = {
    added: [],
  }
  private eventHandlers: {
    [event in ConversationEvent]: ConversationEventHandler<event>[]
  } = {
    message: [],
    channel: [],
  }

  private _channels: Channel[] = []
  public get channels() {
    return this._channels
  }
  public addChannel(channel: Channel) {
    this._channels.push(channel)
    channel.on('message', msg => {
      this.eventHandlers.message.forEach(handler => handler(msg))
    })
  }

  protected constructor(
    public readonly id: string,
    public readonly participants: string[],
    channels: string[] = []
  ) {
    Conversation.instances[id] = this
    Conversation.staticEventHandlers.added?.forEach(handler => handler(this))
    channels.forEach(id => this.addChannel(Channel.get(id)))
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

  public static onStatic(event: StaticEvent, handler: StaticEventHandler) {
    Conversation.staticEventHandlers[event].push(handler)
    return () =>
      Conversation.staticEventHandlers[event].filter(v => v !== handler)
  }

  public on<T extends ConversationEvent>(
    event: T,
    handler: ConversationEventHandler<T>
  ) {
    // @ts-ignore
    this.eventHandlers[event].push(handler)
    return () => {
      // @ts-ignore
      this.eventHandlers[event] = this.eventHandlers[event].filter(
        v => v !== handler
      )
    }
  }
}

type StaticEvent = 'added'
type StaticEventHandler = (v: Conversation) => any

type ConversationEvent = 'message' | 'channel'
type ConversationEventHandler<T extends ConversationEvent> = (
  v: ConversationEventPayload<T>
) => any
type ConversationEventPayload<T extends ConversationEvent> = T extends 'message'
  ? Message
  : Channel
