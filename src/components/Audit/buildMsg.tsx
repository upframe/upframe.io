import React from 'react'
import { isUUID } from 'utils/validate'
import { Link, Abbr } from '..'
import { Message } from './styles'
import type { QueryAuditTrail_audit } from 'gql/types'

export default (ctx: QueryAuditTrail_audit['objects']) => {
  function msg(strs: TemplateStringsArray, ...exprs: string[]) {
    let nodes: (JSX.Element | string)[] = []
    let slice = 0
    for (let i = 0; i < strs.length; i++) {
      nodes.push(strs[i].slice(slice))
      slice = 0
      if (i >= exprs.length) continue
      if (isUUID(exprs[i])) nodes.push(formatEntity(exprs[i]))
      else if (strs[i].endsWith('"') && strs[i + 1]?.startsWith('"')) {
        nodes[nodes.length - 1] = (nodes[nodes.length - 1] as string).slice(
          0,
          -1
        )
        slice = 1
        nodes.push(<Abbr key={i}>{exprs[i]}</Abbr>)
      } else nodes.push(exprs[i])
    }
    return <Message>{nodes}</Message>
  }

  function formatEntity(id: string | undefined): JSX.Element | string {
    const entity = ctx?.find(o => o.id === id)
    if (!entity) return id ?? ''
    const type = entity.__typename === 'Space' ? 'space' : 'user'
    return (
      <Link
        to={`/${type === 'space' ? 'space/' : ''}${entity.handle}`}
        data-type={type}
        key={id}
      >
        {entity.name}
      </Link>
    )
  }

  return msg
}
