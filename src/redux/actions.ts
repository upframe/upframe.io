// prettier-ignore
export interface Actions {
  ADD_USER:     { value: Require<GqlType<Person>, 'id'> }
  SET_ME_ID:    { value: Person['id'] }
}

// Action creator. The type of the payload depends on the specified action.
// If the action type has the form { value: ... } the value of the value property
// may directly be passed as payload. If the action type is { value: boolean }, passing
// a payload is optional.

export default function<
  T extends keyof Actions,
  K extends Actions[T] extends { value: any } ? Actions[T]['value'] : never
>(type: T, ...[payload]: CondOpt<Actions[T], K>) {
  return {
    type,
    ...((typeof (payload ?? {}) === 'object' && !Array.isArray(payload)
      ? payload
      : { value: payload }) as Actions[T]),
  } as assemble<T>
}

type CondOpt<T, K> = T extends { value: boolean } ? [(T | K)?] : [T | K]
export type assemble<T extends keyof Actions> = {
  type: T
} & (Actions[T] extends undefined ? {} : Actions[T])
