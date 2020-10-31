import React from 'react'
import type { QueryAuditTrail_audit } from 'gql/types'
import { useComputed } from 'utils/hooks'
import { Link } from 'react-router-dom'
import { isUUID } from 'utils/validate'
import * as S from './styles'

const formatDate = (date: Date) =>
  `${new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })}, ${date.getFullYear()}  ${date.toLocaleTimeString('en-US')}`

const Abbr: React.FC<{ limit?: number }> = ({ limit = 20, children }) => {
  if (typeof children !== 'string') return null
  if (children.length <= limit) return <S.Abbr as="span">{children}</S.Abbr>
  return <S.Abbr title={children}>{children.slice(0, limit)}…</S.Abbr>
}

interface Props {
  log: QueryAuditTrail_audit
}

export default function Log({ log }: Props) {
  const message = useComputed(log, buildMessage, 'json')
  const time = useComputed(new Date(log.date), formatDate, 'json')

  return (
    <S.Log>
      {message}
      <S.Time>{time}</S.Time>
    </S.Log>
  )
}

type AuditEvent = QueryAuditTrail_audit & {
  eventType: string
  editor: string
  [k: string]: string
}

function buildMessage(raw: QueryAuditTrail_audit) {
  const log: AuditEvent = { ...JSON.parse(raw.payload), ...raw }

  const formatEntity = (id: string | undefined): JSX.Element | string => {
    const entity = log.objects?.find(o => o.id === id)
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

  const spaceRole = log.owner ? 'owner' : log.mentor ? 'mentor' : 'founder'

  const msg = (strs: TemplateStringsArray, ...exprs: string[]) => {
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
    return <S.Message>{nodes}</S.Message>
  }

  switch (log.eventType) {
    case 'create_space':
      return msg`${log.editor} created ${log.space}`
    case 'add_user':
      return msg`${log.editor} added ${log.user} to ${log.space}`
    case 'change_member_role': {
      const [verb, prep] = (log.mentor || log.owner
        ? 'added to'
        : 'removed from'
      ).split(' ')
      const group = 'mentor' in log ? 'mentors' : 'owners'
      return msg`${log.editor} ${verb} ${log.user} ${prep} ${group}`
    }
    case 'upload_cover_photo':
    case 'upload_space_photo':
      return msg`${log.editor} uploaded a new ${
        log.eventType.split('_')[1]
      } image`
    case 'remove_member':
      return log.editor === log.user
        ? msg`${log.editor} left ${log.space}`
        : msg`${log.editor} removed ${log.user} from ${log.space}`
    case 'join_space':
      return msg`${log.editor} joined ${log.space} as a ${spaceRole}`
    case 'create_invite_link':
      return msg`${log.editor} created an invite link for ${spaceRole}s`
    case 'revoke_invite_link':
      return msg`${log.editor} revoked a ${spaceRole} invite link`
    case 'change_space_info':
      return msg`${log.editor} changed ${log.space}'s ${log.field} from "${log.old}" to "${log.new}"`
    case 'edit_user_info':
      return msg`${log.editor} changed ${log.user}'s ${log.field} from "${log.old}" to "${log.new}"`
    default:
      return (
        <S.Message as="pre">
          {JSON.stringify(raw.payload)
            .slice(2, -2)
            .replace(/(?<=:\s*)\\"|\\"(?=,|$)/g, '"')
            .replace(/\\"/g, '')
            .replace(/,/g, '\n')
            .replace(/:\s*/g, ': ')}
        </S.Message>
      )
  }
}
