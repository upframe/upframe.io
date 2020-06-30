import { useState, useEffect, useReducer, useRef } from 'react'
import debounce from 'lodash/debounce'
import { useHistory } from 'react-router-dom'
import {
  gql,
  queries,
  mutations,
  useQuery,
  useMutation,
  useSubscription,
} from 'gql'
import isEqual from 'lodash/isEqual'
import api from 'api'
import { Me } from 'gql/types'

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

export function useDebouncedInputCall(
  input: unknown,
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
    history.push('/')
  }
}

export function useSignOut() {
  const history = useHistory()

  return () => {
    api.writeQuery({ query: queries.ME, data: { me: null } })
    history.push('/login')
  }
}

const MSG_SUB = gql`
  subscription MsgSubscription($channel: ID!) {
    message(channel: $channel) {
      id
      content
      author
      time
    }
  }
`

const SEND_MESSAGE = gql`
  mutation SendChatMsg($content: String!, $channel: ID!) {
    sendMessage(content: $content, channel: $channel)
  }
`

export function useChat(channel: any, messages: any) {
  const [msgs, setMsgs] = useState(messages ?? [])
  const [sendMessage] = useMutation(SEND_MESSAGE)
  const { me } = useMe()

  useSubscription(MSG_SUB, {
    variables: { channel },
    onSubscriptionData({ subscriptionData }) {
      let i = msgs.findIndex(
        ({ local, content, id }) =>
          id === subscriptionData.data.message.id ||
          (local && content === subscriptionData.data.message.content)
      )
      if (i < 0) i = Infinity
      setMsgs([
        ...msgs.slice(0, i),
        subscriptionData.data.message,
        ...msgs.slice(i + 1),
      ])
    },
  })

  useEffect(() => {
    setMsgs(messages ?? [])
  }, [messages])

  function send(content) {
    setMsgs([
      ...msgs,
      {
        id: Date.now(),
        content,
        author: me?.id,
        time: new Date().toISOString(),
        local: true,
      },
    ])
    sendMessage({
      variables: { content, channel },
    })
  }

  return [msgs, send]
}
