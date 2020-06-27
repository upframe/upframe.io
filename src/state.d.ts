interface State {
  users: { [k: Person['id']]: Person }
  conversations: Channel[]
  meId: Person['id'] | null
  loggedIn: boolean
}

interface Channel {
  id: string
}
