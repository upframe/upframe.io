import { render } from 'utils/markdown'
import type { Message as GqlMsg } from 'gql/types'

export default class Message {
  public previous?: Message | null
  public next?: Message | null

  constructor(
    public readonly id: string,
    public readonly content: string | null | undefined,
    public markup: string | null | undefined,
    public readonly author: string,
    public readonly channelId: string,
    public readonly date: Date,
    public readonly unixTime = date.getTime()
  ) {
    if (content && !markup) this.markup = render(content)
  }

  public static fromGqlMsg(msg: GqlMsg) {
    return new Message(
      msg.id,
      msg.content,
      msg.markup,
      msg.author,
      msg.channel,
      new Date(msg.time)
    )
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
