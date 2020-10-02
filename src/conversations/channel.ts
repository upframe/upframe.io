import api from 'api'
import * as gql from './gql'
import type {
  ChannelMsgs,
  ChannelMsgsVariables,
  SendChatMessage,
  SendChatMessageVariables,
} from 'gql/types'
import Message from './message'

export default class Channel {
  private static instances: { [id: string]: Channel } = {}
  private msgs: Message[] = []
  public hasFirst = false
  public hasLatest = false
  private eventHandlers: {
    [event in ChannelEvent]: ChannelEventHandler<event>[]
  } = {
    message: [],
    fetch: [],
    unread: [],
  }
  private unread: string[] = []

  private _fetching = false
  private get fetching() {
    return this._fetching
  }
  private set fetching(v: boolean) {
    this._fetching = v
    this.eventHandlers.fetch.forEach(handler => handler(v ? 'start' : 'stop'))
  }

  private _startTime?: Date
  public get startTime() {
    return this._startTime
  }

  protected constructor(public readonly id: string) {}

  public static get = (id: string) =>
    id in Channel.instances
      ? Channel.instances[id]
      : (Channel.instances[id] = new Channel(id))

  public async messages(query: MsgQuery): Promise<Message[]> {
    const dir: 'forward' | 'backward' =
      !('first' in query) && !('after' in query) ? 'backward' : 'forward'

    if (dir === 'forward' && ('last' in query || 'before' in query))
      throw Error(`can't mix forward & backward query options`)

    let num =
      dir === 'forward'
        ? (query as MsgQueryForward).first
        : (query as MsgQueryBackward).last

    let cursor =
      dir === 'forward'
        ? (query as MsgQueryForward).after
        : (query as MsgQueryBackward).before

    const res = this.checkAvailable(dir, num, cursor)
    if (res === true) return this.readLocal(dir, num, cursor)
    if (res.chainEnd) return this.readLocal(dir, num - res.num, cursor)

    const done = await this.fetchQueue()

    const { data } = await api.query<ChannelMsgs, ChannelMsgsVariables>({
      query: gql.CHANNEL_MSGS,
      variables: {
        id: this.id,
        ...(dir === 'forward'
          ? { first: res.num, after: res.cursor }
          : { last: res.num, before: res.cursor }),
      },
    })

    const messages = data?.channel?.messages
    if (!messages) throw Error(`couldn't fetch messages`)

    let hasPages = [
      !messages.pageInfo.hasPreviousPage,
      !messages.pageInfo.hasNextPage,
    ]
    if (dir === 'backward') hasPages.reverse()
    ;[this.hasFirst, this.hasLatest] = hasPages

    const msgs =
      data?.channel?.messages.edges.flatMap(({ node }) =>
        node ? [Message.fromGqlMsg({ ...node, channel: this.id })] : []
      ) ?? []

    if (msgs.length) this.addMsgs(msgs)

    if (this.hasFirst && !this.startTime) this._startTime = this.msgs[0].date

    done()

    return this.readLocal(dir, num, cursor)
  }

  public async ranges(queries: MsgQuery[]): Promise<Message[]> {
    return Channel.dedupe(
      (await Promise.all(queries.map(query => this.messages(query))))
        .flat()
        .sort((a, b) => a.unixTime - b.unixTime)
    )
  }

  private static dedupe(msgs: Message[]): Message[] {
    return msgs.filter(
      ({ id }, i) => msgs.findIndex(msg => msg.id === id) === i
    )
  }

  private addMsgs(msgs: Message[]) {
    msgs.forEach(msg => {
      if (this.msgs.length === 0) {
        if (this.hasFirst) msg.previous = null
        if (this.hasLatest) msg.next = null
        this.msgs = [msg]
        return
      }
      let alreadyKnown = false
      let firstAfter = Infinity
      for (let i = 0; i < this.msgs.length; i++)
        if (this.msgs[i].id === msg.id) {
          alreadyKnown = true
          break
        } else if (this.msgs[i].unixTime > msg.unixTime) {
          firstAfter = i
          break
        }
      if (alreadyKnown) return
      if (firstAfter === 0) {
        if (this.hasFirst) msg.previous = null
      } else if (firstAfter === Infinity) {
        if (this.hasLatest) msg.next = null
        const previous = this.msgs[this.msgs.length - 1]
        msg.previous = previous
        previous.next = msg
      } else {
        const previous = this.msgs[firstAfter - 1]
        msg.previous = previous
        if (previous.next) previous.next.previous = msg
        previous.next = msg
      }
      this.msgs = [
        ...this.msgs.slice(0, firstAfter),
        msg,
        ...this.msgs.slice(firstAfter),
      ]
    })
  }

  private checkAvailable(
    direction: 'forward' | 'backward',
    num: number,
    cursor?: string
  ): true | { num: number; cursor?: string; chainEnd: boolean } {
    const walk = (
      dir: 'Forth' | 'Back',
      num: number,
      cursor: string
    ): true | { num: number; cursor?: string; chainEnd: boolean } => {
      const [node, n] = (this.msgs.find(({ id }) => id === cursor) as Message)[
        `walk${dir}`
      ](num)
      if (n === 0 || node[dir === 'Forth' ? 'next' : 'previous'] === null)
        return true
      return {
        cursor: node.id,
        num: n,
        chainEnd: node[dir === 'Forth' ? 'next' : 'previous'] === null,
      }
    }

    if (
      !cursor &&
      ((direction === 'forward' && !this.hasFirst) ||
        (direction === 'backward' && !this.hasLatest))
    )
      return { num, cursor, chainEnd: false }

    return cursor
      ? walk(direction === 'forward' ? 'Forth' : 'Back', num, cursor)
      : direction === 'forward'
      ? walk('Forth', num - 1, this.msgs[0].id)
      : walk('Back', num - 1, this.msgs[this.msgs.length - 1].id)
  }

  private readLocal(
    direction: 'forward' | 'backward',
    num: number,
    cursor?: string
  ): Message[] {
    let cursorIndex = cursor
      ? this.msgs.findIndex(({ id }) => id === cursor)
      : direction === 'forward'
      ? -1
      : this.msgs.length
    return direction === 'forward'
      ? this.msgs.slice(cursorIndex + 1, cursorIndex + 1 + num)
      : this.msgs.slice(Math.max(cursorIndex - num, 0), cursorIndex)
  }

  private _queue: Promise<any>[] = [Promise.resolve()]
  private async fetchQueue() {
    this.fetching = true
    let done = () => {}
    const action = new Promise(resolve => {
      done = () => {
        this.fetching = false
        resolve()
      }
    })

    const waitFor = this._queue.slice(-1)[0]
    this._queue.push(action)

    await waitFor

    return done
  }

  public async sendMessage(content: string, meId: string) {
    const id = Date.now().toString()
    this.postMessage(
      new Message(id, content, undefined, meId, this.id, new Date())
    )
    const { data } = await api.mutate<
      SendChatMessage,
      SendChatMessageVariables
    >({
      mutation: gql.SEND_MESSAGE,
      variables: { channel: this.id, content },
    })
    this.msgs.splice(
      this.msgs.findIndex(msg => msg.id === id),
      1
    )
    const msg = { ...data?.sendMessage, channel: this.id }
    if (msg) this.postMessage(Message.fromGqlMsg(msg as any))
  }

  public postMessage(msg: Message) {
    this.addMsgs([msg])
    this.eventHandlers.message.forEach(handler => handler(msg))
  }

  public on<T extends ChannelEvent>(event: T, handler: ChannelEventHandler<T>) {
    // @ts-ignore
    this.eventHandlers[event].push(handler)
    return () => {
      // @ts-ignore
      this.eventHandlers[event] = this.eventHandlers[event].filter(
        v => v !== handler
      )
    }
  }

  public setReadStatus(...msgs: { id: string; read: boolean }[]) {
    const old = this.unread.length
    this.unread = [
      ...this.unread.filter(
        v => !msgs.find(({ id, read }) => read && id === v)
      ),
      ...msgs.flatMap(({ id, read }) => (read ? [] : [id])),
    ]
    this.eventHandlers.unread.forEach(handler =>
      handler(
        msgs.filter(({ read }) => read).map(({ id }) => id),
        this.unread.length - old
      )
    )
  }

  public isUnread(msgId: string) {
    ;(window as any).channel = this
    return this.unread.includes(msgId)
  }
}

type MsgQueryBackward = {
  last: number
  before?: string
}

type MsgQueryForward = {
  first: number
  after?: string
}

export type MsgQuery = MsgQueryBackward | MsgQueryForward

type ChannelEvent = 'message' | 'fetch' | 'unread'
type ChannelEventHandler<T extends ChannelEvent> = (
  ...v: ChannelEventPayload<T>
) => any
type ChannelEventPayload<T extends ChannelEvent> = T extends 'message'
  ? [Message]
  : T extends 'fetch'
  ? ['start' | 'stop']
  : [string[], number]
