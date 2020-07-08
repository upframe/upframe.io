interface CacheAccess {
  at(i: number): number
  sum(start: number, length: number): number
  searchSum(sum: number, offset?: number): number
}

class SumCache implements CacheAccess {
  private partitions: SumCache[] = []
  private _sum: number

  constructor(
    public offset: number,
    private readonly getValue: (i: number) => number,
    private values: number[] = [],
    private partitionLength = 100,
    sum?: number
  ) {
    this._sum = sum ?? values?.reduce((a, c) => a + c, 0)
    if (!partitionLength || !values.length) return
    for (let i = 0; i < ((values.length / partitionLength) | 0); i++) {
      this.partitions.push(
        new SumCache(
          i * partitionLength + this.offset,
          SumCache.noEval,
          values.slice(i * partitionLength, (i + 1) * partitionLength),
          0
        )
      )
    }
  }

  public get max() {
    return this.offset + this.values.length - 1
  }

  public at(i: number): number {
    this.checkInRange(i)
    if (this.values.length > i - this.offset && i - this.offset >= 0)
      return this.values[i - this.offset]
    return this.write(i)
  }

  public sum(start: number = this.offset, end: number = this.max): number {
    this.checkInRange(start, end)

    if (start === this.offset && end === this.max) return this._sum
    if (end === start) return this.values[start - this.offset]

    let p1 = this.partitions.length
      ? (this.partitions.find(
          part => part.offset <= start && part.max >= end
        ) as SumCache)
      : undefined

    if (!p1 || this.partStart > end || this.partEnd < start)
      return this.values
        .slice(start - this.offset, end - this.offset + 1)
        .reduce((a, c) => a + c)

    let v = 0

    for (let i = start - this.offset; i < p1.offset - this.offset; i++)
      v += this.values[i]

    for (let i = this.partitions.indexOf(p1); this.partitions[i]; i++) {
      v += this.partitions[i].sum(
        Math.max(p1.offset, start),
        Math.min(end, p1.max)
      )
      if (this.partitions[i].max >= end) return v
    }

    return v
  }

  protected static intersect(v: number, start: number, end: number): boolean {
    return v >= Math.min(start, end) && v < Math.max(start, end)
  }

  public searchSum(sum: number, offset = 0): number {
    let tmpSum = 0
    let part = this.partitions.find(p => p.offset <= offset && p.max >= offset)

    if (!part) {
      const nextPart = this.partitions.find(p => p.max >= offset)
      if (nextPart) {
        const off = this.sum(offset, nextPart.offset - 1)
        if (!SumCache.intersect(sum, 0, off)) {
          part = nextPart
          tmpSum = off
        }
      }
    }

    while (part) {
      const partSum = part.sum(Math.max(part.offset, offset), part.max)
      if (tmpSum + partSum > sum)
        return part.searchSum(sum - tmpSum, Math.max(offset, part.offset))
      tmpSum += partSum
      const nextOff = part.max + 1
      part = this.partitions.find(p => p.offset === nextOff)
    }

    let i = offset - this.offset

    let acc = 0
    for (i; i < this.values.length; i++) {
      acc += this.values[i]
      if (acc >= sum) break
    }
    if (acc < sum) return Infinity
    return i + this.offset + (acc === sum ? 1 : 0)
  }

  private write(i: number, v: number = this.getValue(i)): number {
    this.checkInRange(i)
    if (i - this.offset >= 0 && i - this.offset < this.values.length) {
      this.values[i] = v
      return v
    }
    let front = i - this.offset < 0
    if (front) {
      this.offset--
      this.values.unshift(v)
    } else {
      this.values.push(v)
    }
    this._sum += v

    if (!this.partitionLength) return v

    if (
      !front &&
      this.values.length + this.offset - this.partEnd === this.partitionLength
    )
      this.partitions.push(
        new SumCache(
          this.partEnd + 1,
          SumCache.noEval,
          this.values.slice(this.partEnd - this.offset + 1),
          0
        )
      )
    else if (front && this.partStart - this.offset === this.partitionLength)
      this.partitions.unshift(
        new SumCache(
          this.offset,
          SumCache.noEval,
          this.values.slice(0, this.partStart - this.offset),
          0
        )
      )

    return v
  }

  private get partStart() {
    return this.partitions[0]?.offset ?? this.values.length + this.offset
  }

  private get partEnd() {
    return this.partitions[this.partitions.length - 1]?.max ?? this.offset - 1
  }

  private static noEval(): never {
    throw Error("partition shouldn't reevalutate value")
  }

  private checkInRange(...indexes: number[]): void {
    for (let i of indexes)
      if (i - this.offset > this.values.length || i < this.offset - 1)
        throw Error(`can't access index ${i}, cache must be continuous`)
  }

  public static merge(a: SumCache, b: SumCache): SumCache {
    return new SumCache(
      a.offset,
      a.getValue,
      [...a.values, ...b.values],
      a.partitionLength,
      a._sum + b._sum
    )
  }
}

export default class CacheManager implements CacheAccess {
  private caches: SumCache[] = []

  constructor(private readonly getValue: (i: number) => number) {}

  public at(i: number): number {
    const { cache, isNew } = this.getCache(i)
    const v = cache.at(i)
    if (isNew) return v
    const next = this.getNext(cache)
    if (next && next.offset === i + 1) this.merge(cache, next)
    return v
  }

  private getCache(offset: number): { cache: SumCache; isNew: boolean } {
    let i = 0
    let cache: SumCache | undefined
    for (i; i < this.caches.length; i++) {
      if (this.caches[i].offset > offset + 1) break
      else if (this.caches[i].max >= offset - 1) {
        cache = this.caches[i]
        break
      }
    }
    if (cache) return { cache, isNew: false }

    if (i === this.caches.length - 1 && this.caches[i].max < i) i++
    cache = new SumCache(offset, this.getValue)
    this.caches = [...this.caches.slice(0, i), cache, ...this.caches.slice(i)]
    return { cache, isNew: true }
  }

  public sum(start: number, end = start): number {
    if (end < start || !Number.isInteger(end))
      throw Error('end must be integer >= start')

    const step = (cache: SumCache): SumCache => {
      const next = this.getNext(cache)
      if (cache.max >= end || (next?.offset ?? Infinity) > end + 1) {
        for (let i = cache.max + 1; i <= end; i++) cache.at(i)
        return cache
      }
      for (let i = cache.max + 1; i < next?.offset; i++) cache.at(i)
      return this.merge(cache, next)
    }

    let { cache } = this.getCache(start)
    while (cache.max < end) cache = step(cache)
    return cache.sum(start, end)
  }

  public searchSum(sum: number, offset = 0): number {
    let { cache } = this.getCache(offset)

    let i = cache.searchSum(sum, offset)
    if (i !== Infinity) return i

    let tmp = cache.sum(offset)
    let next = this.caches[this.caches.indexOf(cache) + 1]

    while (tmp < sum) {
      tmp += cache.at(cache.max + 1)
      if (next && cache.max === next.offset - 1) {
        cache = this.merge(cache, next)
        next = this.caches[this.caches.indexOf(cache) + 1]
      }
    }

    return cache.searchSum(sum, offset)
  }

  private merge(a: SumCache, b: SumCache): SumCache {
    const merged = SumCache.merge(a, b)
    this.caches.splice(this.caches.indexOf(a), 2, merged)
    return merged
  }

  private getNext(cache: SumCache): SumCache {
    return this.caches[this.caches.indexOf(cache) + 1]
  }
}
