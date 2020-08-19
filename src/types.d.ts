type Person = import('./gql/types').Mentor
type ChatParticipant = import('./gql/types').ChatParticipant

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : RecursivePartial<T[P]>
}

type Require<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

type Optional<T extends object, K extends keyof T = keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

type GqlType<T> = RecursivePartial<Omit<T, '__typename'>>

type CondOpt<T, K> = T extends { value: boolean } ? [(T | K)?] : [T | K]

type Participant = Require<Partial<ChatParticipant>, 'id'>
