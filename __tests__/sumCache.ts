import Cache from 'utils/sumCache'

describe('Sum Cache', () => {
  let gets = 0
  const get = (i: number) => {
    gets++
    return i * 10 + 5
  }
  const cache = new Cache(get)

  const testCacheNum = (n: number) =>
    it(`number of caches: ${n}`, () =>
      expect((cache as any).caches.length).toBe(n))
  const testGets = (n: number) =>
    it(`number of evalutations: ${n}`, () => expect(gets).toBe(n))
  const testAt = (i: number, v: number) =>
    it(`has value at ${i}: ${v}`, () => expect(cache.at(i)).toBe(v))

  it('read from cache', () => expect(cache.at(1)).toBe(15))
  testCacheNum(1)
  testGets(1)

  it('can return value again', () => expect(cache.at(1)).toBe(15))
  testGets(1)
  testCacheNum(1)

  it('can return next index', () => expect(cache.at(2)).toBe(25))
  testGets(2)
  testCacheNum(1)

  it('sum up cache', () => expect(cache.sum(1, 2)).toBe(40))

  it('read outside existing cache', () => expect(cache.at(5)).toBe(55))
  testCacheNum(2)
  testGets(3)

  it('can sum outside existing range', () => expect(cache.sum(5, 7)).toBe(195))
  it('can sum over multiple caches', () => expect(cache.sum(1, 7)).toBe(315))
  testCacheNum(1)
  testGets(7)

  it('can sum subsection', () => expect(cache.sum(3, 5)).toBe(135))

  it('read previous adjacent index', () => expect(cache.at(0)).toBe(5))
  testCacheNum(1)

  it('sum next adjacent indexes', () => expect(cache.sum(8, 9)).toBe(180))
  testCacheNum(1)
  it('sum previous adjacent indexes', () => expect(cache.sum(-2, -1)).toBe(-20))
  testCacheNum(1)

  // adjacent read merge
  testAt(11, 115)
  testCacheNum(2)
  testAt(10, 105)
  testCacheNum(1)
  testAt(-4, -35)
  testCacheNum(2)
  testAt(-3, -25)
  testCacheNum(1)

  // reading over multiple caches
  testAt(13, 135)
  testAt(15, 155)
  testAt(17, 175)
  testGets(19)
  testCacheNum(4)
  it('sum over multiple caches', () => expect(cache.sum(-3, 18)).toBe(1760))
  testCacheNum(1)

  it('has no partitions', () =>
    expect((cache as any).caches[0].partitions.length).toBe(0))
  it('create partition', () => expect(cache.sum(0, 100)).not.toBeNull())
  it('has 1 partition', () =>
    expect((cache as any).caches[0].partitions.length).toBe(1))
  it('create partition', () => expect(cache.sum(-100, 0)).not.toBeNull())
  it('has 2 partitions', () =>
    expect((cache as any).caches[0].partitions.length).toBe(2))

  const calcSum = (start: number, end: number): number =>
    Array(end - start + 1)
      .fill(0)
      .map((_, i) => i + start)
      .map(i => i * 10 + 5)
      .reduce((a, c) => a + c)

  const testSum = (start: number, end: number, v = calcSum(start, end)) =>
    it(`sum of ${start} to ${end} is ${v}`, () =>
      expect(cache.sum(start, end)).toBe(v))

  testSum(0, 1000)

  const steps = [17, 35, 78, 102, 153, 217, 389]

  for (const step of steps) {
    for (let i = 0; i < Math.floor(1000 / step); i++)
      testSum(i * step, (i + 1) * step)
  }

  it('can search sum', () =>
    expect(cache.searchSum(calcSum(0, 550) + 5, 0)).toBe(551))
  it('can search sum', () =>
    expect(cache.searchSum(calcSum(0, 550), 0)).toBe(551))
  it('can search sum', () =>
    expect(cache.searchSum(calcSum(0, 550) - 1, 0)).toBe(550))

  testAt(-101, -1005)
  it('can search sum starting in front of partition', () =>
    expect(cache.searchSum(calcSum(-101, 2) + 5, -101)).toBe(3))
})
