import { useState, useEffect } from 'react'
import subscription from './subscription'

type Action = JSX.Element | null
const actionSub = subscription<Action>()

export function useNavActions(v: Action) {
  const [action, setAction] = useState<Action>()

  useEffect(() => actionSub.subscribe(setAction), [])

  return {
    action,
    show: () => actionSub._call(v),
    hide: () => actionSub._call(null),
  }
}

const navbarSub = subscription<boolean>()

export function useNavbar() {
  const [visible, setVisible] = useState(true)

  useEffect(() => navbarSub.subscribe(setVisible), [])

  return {
    visible,
    show: () => navbarSub._call(true),
    hide: () => navbarSub._call(false),
  }
}
