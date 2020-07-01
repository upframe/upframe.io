import type { Message as GqlMsg } from 'gql/types'

export default class Message {
  public previous?: Message | null
  public next?: Message | null

  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly author: string,
    public readonly date: Date,
    public readonly unixTime = date.getTime()
  ) {}

  public static fromGqlMsg(msg: Optional<GqlMsg, 'channel'>) {
    return new Message(msg.id, msg.content, msg.author, new Date(msg.time))
  }

  public walkBack(num: number): [Message, number] {
    if (num <= 0 || !this.previous) return [this, num]
    return this.previous.walkBack(num - 1)
  }

  public walkForth(num: number): [Message, number] {
    if (num <= 0 || !this.next) return [this, num]
    return this.next.walkForth(num - 1)
  }
}
