import React from 'react'
import styled from 'styled-components'
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
  return (
    // @ts-ignore
    <S.Link
      {...(external ? { href: to } : { as: RouterLink, to })}
      {...(newTab && { target: '_blank', rel: 'noopener noreferrer' })}
      {...rest}
    >
      {children}
    </S.Link>
  )
}

const S = {
  Link: styled.a<{ wrap: boolean }>`
    /* stylelint-disable-next-line */
    ${({ wrap }) => (wrap ? `display: contents;` : '')}
  `,
}
