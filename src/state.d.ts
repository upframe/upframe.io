interface State {
  users: { [k: Person['id']]: Person }
  conversations: Channel[]
  meId: Person['id'] | null
}

interface Channel {
  id: string
}
