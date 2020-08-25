import { useState, useEffect, useReducer, useRef } from 'react'
import debounce from 'lodash/debounce'
import { useHistory } from 'react-router-dom'
import { queries, mutations, useQuery, useMutation } from 'gql'
import isEqual from 'lodash/isEqual'
import api from 'api'
import type { Me, Mentors } from 'gql/types'
import type { DocumentNode } from 'graphql'
import { isSameDay, isPreviousDay } from './date'
import subscription from './subscription'

export { useHistory }

export function useScrollAtTop() {
  const [atTop, setAtTop] = useState(window.scrollY === 0)

  useEffect(() => {
    function handleScrollStart() {
      setAtTop(false)
      window.addEventListener('scroll', handleScrollStop, { passive: true })
    }

    const handleScrollStop = debounce(
      () => {
        if (window.scrollY !== 0) return
        setAtTop(true)
        window.removeEventListener('scroll', handleScrollStop)
        window.addEventListener('scroll', handleScrollStart, {
          passive: true,
          once: true,
        })
      },
      100,
      { leading: false, trailing: true }
    )

    window.addEventListener('scroll', handleScrollStart, {
      passive: true,
      once: true,
    })
    return () =>
      window.removeEventListener(
        'scroll',
        window.scrollY === 0 ? handleScrollStart : handleScrollStop
      )
  }, [])

  return atTop
}

export function useCalendars(requested: string[]) {
  const [calNotFetched, setCalNotFetched] = useState<string[]>([])
  const [calendars, setCalendars] = useState<any[]>([])
  const { me } = useMe()

  const {
    data: { user: { calendars: gcals = [] } = {} } = {},
    loading,
  } = useQuery(queries.GCAL_EVENTS, {
    variables: { calendarIds: calNotFetched, id: me?.id, skip: !me },
  })

  // add to fetch list
  useEffect(() => {
    if (loading) return
    const diff = requested.filter(id => !calendars.find(cal => cal.id === id))
    const missing = diff.filter(id => !calNotFetched.includes(id))
    if (missing.length > 0) setCalNotFetched([...calNotFetched, ...missing])
    const remove = calendars.filter(({ id }) => !requested.includes(id))
    if (remove.length > 0)
      setCalendars(
        calendars.filter(({ id }) => !remove.find(cal => cal.id === id))
      )
  }, [requested, calendars, calNotFetched, loading])

  // add fetched to calendars
  useEffect(() => {
    if (loading) return
    const newlyFetched = (gcals || []).filter(
      ({ id }) =>
        !calendars.find(cal => cal.id === id) && requested.includes(id)
    )
    if (newlyFetched.length === 0) return
    const newCalendars = [...calendars, ...newlyFetched]
    setCalendars(newCalendars)
    setCalNotFetched(
      calNotFetched.filter(id => !newCalendars.find(cal => cal.id === id))
    )
  }, [loading, gcals, calendars, calNotFetched, requested])

  return [calendars, calNotFetched]
}

export function useMe() {
  const [setTz, { loading: tzChanging }] = useMutation(mutations.SET_TIMEZONE)

  const { data, loading } = useQuery<Me>(queries.ME, {
    onCompleted({ me }) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (tzChanging || !tz || !me?.inferTz || me.timezone?.iana === tz) return
      setTz({ variables: { tz } })
    },
  })

  return { me: data?.me, loading: loading ?? true }
}

export function useDebouncedInputCall<T extends any>(
  input: T,
  { initial = input, inputDelay = 1.7, maxDelay = 200 } = {}
) {
  const [lastInput, setLastInput] = useState(input)
  const [inputStamps, setInputStamps] = useReducer(
    (c, v) => (v === undefined ? [] : [...c, ...(Array.isArray(v) ? v : [v])]),
    []
  )
  const [cancelGo, setCancelGo] = useState<ReturnType<typeof setTimeout>>()
  const [debounced, setDebounced] = useState(initial)

  const setInputStampsRef = useRef(setInputStamps)
  setInputStampsRef.current = setInputStamps
  const setDebouncedRef = useRef(setDebounced)
  setDebouncedRef.current = setDebounced
  const inputRef = useRef(input)
  inputRef.current = input

  useEffect(() => {
    if (isEqual(input, lastInput)) return
    setInputStamps(performance.now())
    setLastInput(input)
  }, [input, lastInput])

  useEffect(() => {
    if (cancelGo) clearTimeout(cancelGo)
    if (!inputStamps.length) return

    const inputDelta = inputStamps.slice(1).map((v, i) => v - inputStamps[i])
    const inputAvg = inputDelta.reduce((a, c) => a + c, 0) / inputDelta.length

    setCancelGo(
      setTimeout(
        () => {
          setInputStampsRef.current(undefined)
          setDebouncedRef.current(inputRef.current)
        },
        isNaN(inputAvg) ? maxDelay : Math.min(inputAvg * inputDelay, maxDelay)
      )
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputStamps])

  return debounced
}

export function useSignIn() {
  const history = useHistory()

  return (user: any) => {
    api.writeQuery({ query: queries.ME, data: { me: user } })
    history.push(
      new URLSearchParams(window.location.search).get('unsubscribe')
        ? '/settings/notifications' + window.location.search
        : '/'
    )
  }
}

export function useSignOut() {
  const history = useHistory()

  const [signOut] = useMutation(mutations.SIGN_OUT)

  return async ({
    mutate,
    query = '',
  }: { mutate?: DocumentNode; query?: string } = {}) => {
    if (mutate) await signOut()
    api.writeQuery({ query: queries.ME, data: { me: null } })
    history.push('/login' + query)
  }
}

export function useHeight(ref: React.MutableRefObject<HTMLElement>) {
  const [height, setHeight] = useState<number>()

  useEffect(() => {
    const node = ref.current
    if (!node) return

    function size() {
      setHeight(node.offsetHeight)
    }

    size()

    if (!window.ResizeObserver) return

    const observer = new ResizeObserver(size)
    observer.observe(node, { box: 'border-box' })

    return () => observer.unobserve(node)
  }, [ref])

  return height
}

export function useMatchMedia(query: string) {
  const [match, setMatch] = useState(true)

  function handleEvent(e: MediaQueryListEvent | MediaQueryList) {
    setMatch(e.matches)
  }

  useEffect(() => {
    const mql = window.matchMedia(query)
    handleEvent(mql)
    mql.onchange = handleEvent

    return () => {
      mql.onchange = null
    }
  })

  return match
}

export function useVirtualKeyboard() {
  const isMobile = useMatchMedia('(hover: none) and (pointer: coarse)')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isMobile) return

    let height = window.innerHeight
    function onResize(e) {
      const dh = window.innerHeight - height
      if (Math.abs(dh) >= 200) setOpen(dh < 0)
      height = window.innerHeight
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isMobile])

  return open
}

export function useLoggedIn({
  redirect,
}: { redirect?: string | boolean } = {}) {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem('loggedIn') === 'true'
  )
  const { me, loading } = useMe()
  const history = useHistory()

  useEffect(() => {
    if (loading) return
    setLoggedIn(!!me)
    if (!me && redirect)
      history.push(typeof redirect === 'string' ? redirect : '/login')
  }, [loading, me, redirect, history])

  return loggedIn
}

const sec = 1000
const min = sec * 60
const hour = min * 60
const day = hour * 24
const week = day * 7
const format: [
  number | ((d: Date) => boolean),
  (dt: number, d: Date) => [string, number?, boolean?]
][] = [
  [min, () => ['just now']],
  [10 * min, dt => [`${(dt / min) | 0} min`, min]],
  [hour, dt => [`${((dt / min / 5) | 0) * 5} min`, 5 * min]],
  [5 * hour, dt => [`${(dt / hour) | 0}h ago`, hour]],
  [
    d => isSameDay(d) || isPreviousDay(d),
    (_, d) => [
      isSameDay(d) ? 'today' : 'yesterday',
      new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime() -
        d.getTime(),
    ],
  ],
  [
    d =>
      Date.now() - d.getTime() < day * 7 && new Date().getDay() !== d.getDay(),
    (_, d) => [d.toLocaleDateString('en-US', { weekday: 'short' })],
  ],
  [d => Date.now() - d.getTime() < week * 4, dt => [`${(dt / week) | 0}w ago`]],
  [
    d =>
      Date.now() - d.getTime() < day * 90 ||
      new Date().getFullYear() === d.getFullYear(),
    (_, d) => [d.toLocaleDateString('en-US', { month: 'short' })],
  ],
  [Infinity, (_, d) => [d.getFullYear().toString()]],
]

export function useTimeMarker(date?: Date) {
  const [marker, setMarker] = useState('')

  useEffect(() => {
    if (!date) return
    let toId: number

    function go(date: Date) {
      const dt = Date.now() - date.getTime()
      const [seg, f] = format.find(([max]) =>
        typeof max === 'number' ? max > dt : max(date)
      ) as typeof format[number]

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
  }, [date])

  return marker
}

const mentorSub = subscription<Mentors['mentors']>(set => {
  api
    .query<Mentors>({ query: queries.MENTORS })
    .then(({ data }) => {
      if (!set) return
      set(data?.mentors ?? [])
    })
})

export function useMentors() {
  const [mentors, setMentors] = useState<Mentors['mentors']>(
    mentorSub.state ?? []
  )

  function set(users: Mentors['mentors'] = mentors) {
    mentorSub._call(
      users
        .map(v => ({
          ...v,
          score: (v.sortScore ?? 0) + Math.random(),
        }))
        .sort((a, b) => b.score - a.score)
    )
  }

  useEffect(
    () =>
      mentorSub.subscribe(v => {
        setMentors(v)
      }, set),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return { mentors, set }
}
