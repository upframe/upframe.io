import Cache from './sumCache'

export default class Scroller<T extends any> {
  private readonly frameSize: number
  private lastCursor?: number
  private lastFrame?: T[]

  constructor(
    private readonly getCursor: (i: number) => T,
    public readonly view: number,
    public readonly buffer: number,
    public min: number = -Infinity,
    public max: number = Infinity
  ) {
    if (max - min < view + buffer) throw Error('range is too small for frame')
    this.frameSize = view + 2 * buffer
  }

  read(cursor: number): { frame: T[]; off: number } {
    let range = Array(this.frameSize)
      .fill(0)
      .map((_, i) => cursor - this.buffer + i)

    let off = 0

    const frontOff = this.min - range[0]
    if (frontOff > 0) off = frontOff

    let backOff = this.max - range[range.length - 1]
    if (backOff < 0) off = backOff

    if (off !== 0) range = range.map(v => v + off)

    const ec = cursor + off

    if (this.lastCursor && this.lastFrame) {
      const cd = ec - this.lastCursor
      if (cd === 0) return { frame: this.lastFrame, off }
      if (Math.abs(cd) < this.frameSize) {
        let frame =
          cd < 0
            ? [
                ...range.slice(0, -cd).map(this.getCursor),
                ...this.lastFrame.slice(0, cd),
              ]
            : [
                ...this.lastFrame.slice(cd),
                ...range.slice(-cd).map(this.getCursor),
              ]
        this.lastFrame = frame
        this.lastCursor = ec
        return { frame, off }
      }
    }

    const frame = range.map(this.getCursor)
    this.lastFrame = frame
    this.lastCursor = ec
    return { frame, off }
  }
}

export class DynamicScroller<T extends any> {
  private lastCursor?: number
  private lastFrame?: T[]

  constructor(
    public getCursor: (i: number) => T,
    private readonly sizeCache: Cache,
    public readonly buffer: number,
    public readonly size: number,
    public min: number = -Infinity,
    public max: number = Infinity
  ) {}

  private frameSize(start: number): number {
    let height = 0
    let n = 0
    do {
      n++
      height = this.sizeCache.sum(start, Math.min(start + n - 1, this.max))
    } while (height < this.size && n + start < this.max)
    const res = Math.min(n + 1 + this.buffer * 2, this.max - this.min + 1)
    return res
  }

  read(cursor: number): { frame: T[]; off: number } {
    const size = this.frameSize(Math.max(cursor - this.buffer, this.min))

    let range = Array(Math.ceil(size))
      .fill(0)
      .map((_, i) => cursor - this.buffer + i)

    let off = 0

    const frontOff = this.min - range[0]
    if (frontOff > 0) off = frontOff

    let backOff = this.max - range[range.length - 1]
    if (backOff < 0) off = backOff

    const ec = cursor + off

    if (
      this.lastFrame &&
      ec === this.lastCursor &&
      this.lastFrame.length === size
    )
      return { frame: this.lastFrame, off }

    if (off !== 0) range = range.map(v => v + off)

    const lastCursor = this.lastCursor
    this.lastCursor = ec
    let frame: T[] | null = null

    if (lastCursor && this.lastFrame) {
      if (ec > lastCursor) {
        if (ec <= lastCursor + (this.lastFrame.length - 1)) {
          const si = this.lastFrame.length - (ec - lastCursor)
          frame = [
            ...this.lastFrame.slice(-si),
            ...range.slice(si).map(this.getCursor),
          ]
        }
      } else {
        if (lastCursor <= ec + (size - 1)) {
          const si = lastCursor - ec
          frame = [
            ...range.slice(0, si).map(this.getCursor),
            ...this.lastFrame,
            ...range.slice(this.lastFrame.length).map(this.getCursor),
          ].slice(0, size)
        }
      }
    }

    if (!frame) frame = range.map(this.getCursor)
    this.lastFrame = frame
    return { frame, off }
  }
}
