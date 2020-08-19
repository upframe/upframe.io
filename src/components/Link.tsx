import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

type RLProps = Parameters<typeof RouterLink>[0]

type Props<D extends boolean | undefined> = { disable: D } & {
  external?: boolean
  newTab?: boolean
  wrap?: boolean
} & (D extends false ? RLProps : Optional<RLProps, keyof RLProps>)

export default function Link<D extends boolean | undefined>({
  disable,
  children,
  to,
  external = /^https?:\/\//.test(to as string),
  newTab = external,
  wrap = false,
  ...rest
}: Props<D>) {
  if (disable) return <>{children}</>
  const Tag = external ? 'a' : RouterLink
  return (
    // @ts-ignore
    <Tag
      {...(external ? { href: to } : { to })}
      {...(newTab && { target: '_blank', rel: 'noopener noreferrer' })}
      {...rest}
      {...(wrap && { style: { display: 'contents' } })}
    >
      {children}
    </Tag>
  )
}
