import { useState, useEffect } from 'react'

export const ordNum = (n: number) => {
  if (n >= 10 && n < 20) return n + 'th'
  switch (n % 10) {
    case 1:
      return n + 'st'
    case 2:
      return n + 'nd'
    case 3:
      return n + 'rd'
    default:
      return n + 'th'
  }
}

export const isSameDay = (date: Date, comp = new Date()) =>
  date.getFullYear() === comp.getFullYear() &&
  date.getMonth() === comp.getMonth() &&
  date.getDate() === comp.getDate()

export const isPreviousDay = (
  date: Date,
  comp = new Date(Date.now() - 1000 * 60 ** 2 * 24)
) => date.toLocaleDateString() === comp.toLocaleDateString()

const sec = 1000
const min = sec * 60
const hour = min * 60
const day = hour * 24
const week = day * 7

const interval = {
  minute: {
    short: (v: number) => v + ' min',
    long: (v: number) => `${v} minute${v !== 1 ? 's' : ''}`,
  },
  hour: {
    short: (v: number) => v + 'h',
    long: (v: number) => `${v} hour${v !== 1 ? 's' : ''}`,
  },
  week: {
    short: (v: number) => v + 'w',
    long: (v: number) => `${v} week${v !== 1 ? 's' : ''}`,
  },
} as const

const format: (
  version: 'short' | 'long'
) => [
  number | ((d: Date) => boolean),
  (dt: number, d: Date) => [string, number?, boolean?]
][] = version => {
  const tc = (v: string) =>
    v[`to${version === 'long' ? 'Upper' : 'Lower'}Case`]()

  return [
    [min, () => ['just now']],
    [10 * min, dt => [interval.minute[version]((dt / min) | 0), min]],
    [hour, dt => [interval.minute[version](((dt / min / 5) | 0) * 5), 5 * min]],
    [5 * hour, dt => [interval.hour[version]((dt / hour) | 0) + ' ago', hour]],
    [
      d => isSameDay(d) || isPreviousDay(d),
      (_, d) => [
        tc(isSameDay(d) ? 'today' : 'yesterday'),
        new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime() -
          d.getTime(),
      ],
    ],
    [
      d =>
        Date.now() - d.getTime() < day * 7 &&
        new Date().getDay() !== d.getDay(),
      (_, d) => [tc(d.toLocaleDateString('en-US', { weekday: version }))],
    ],
    [
      d => Date.now() - d.getTime() < week * 4,
      dt => [interval.week[version]((dt / week) | 0) + ' ago'],
    ],
    [
      d =>
        Date.now() - d.getTime() < day * 90 ||
        new Date().getFullYear() === d.getFullYear(),
      (_, d) => [tc(d.toLocaleDateString('en-US', { month: version }))],
    ],
    [Infinity, (_, d) => [d.getFullYear().toString()]],
  ]
}

export function useTimeMarker(
  date?: Date,
  version: 'short' | 'long' = 'short'
) {
  const [marker, setMarker] = useState('')

  useEffect(() => {
    if (!date) return
    let toId: number

    const fmt = format(version)

    function go(date: Date) {
      const dt = Date.now() - date.getTime()
      const [seg, f] = fmt.find(([max]) =>
        typeof max === 'number' ? max > dt : max(date)
      ) as typeof fmt[number]

      const [formatted, interval] = f(dt, date)
      setMarker(formatted)

      if ((seg !== Infinity && typeof seg === 'number') || interval) {
        const wait =
          (!interval
            ? (seg as number) - (dt % (seg as number))
            : typeof seg === 'number'
            ? interval - (dt % interval)
            : interval) + 100
        if (wait < 2 ** 31 - 1) toId = setTimeout(() => go(date), wait)
      }
    }
    go(date)

    return () => clearTimeout(toId)
  }, [date, version])

  return marker
}
