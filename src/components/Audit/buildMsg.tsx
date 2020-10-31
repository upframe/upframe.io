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
      const lastNode: any = nodes[nodes.length - 1]
      // add possessive apostrophe to previous node
      if (
        /^"?'s/.test(strs[i]) &&
        typeof lastNode === 'object' &&
        typeof lastNode.props?.children === 'string'
      ) {
        nodes[nodes.length - 1] = React.cloneElement(
          lastNode,
          lastNode.props,
          `${lastNode.props.children}'s`.replace(/s's/, "s'")
        )
        slice += 2
      }
      nodes.push(strs[i].slice(slice).replace(/<\w+>$/, ''))
      slice = 0
      if (i >= exprs.length) continue
      if (
        isUUID(exprs[i]) ||
        (typeof exprs[i] === 'number' && /<(list|tag)>$/.test(strs[i]))
      )
        nodes.push(formatEntity(exprs[i]))
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
    const entity = ctx?.find(
      o => (o as any).id === id || (o as any).numId === id
    )
    if (!entity) return id ?? ''
    const type = entity.__typename
    const { handle, name } = entity as any
    return (
      <Link
        to={
          ['Space', 'List'].includes(type)
            ? `/${type.toLowerCase()}/${handle ?? name}`
            : type === 'Tag'
            ? `/search?t=${name}`
            : `/${handle}`
        }
        data-type={type}
        key={id}
      >
        {entity.name}
      </Link>
    )
  }

  return msg
}
