type Person = import('./gql/types').Mentor

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : RecursivePartial<T[P]>
}

type Require<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

type GqlType<T> = RecursivePartial<Omit<T, '__typename'>>
