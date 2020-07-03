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
