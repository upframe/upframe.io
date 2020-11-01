import React from 'react'
import type { QueryAuditTrail_audit } from 'gql/types'
import buildMsg from './buildMsg'
import { Message } from './styles'

export default function (raw: QueryAuditTrail_audit) {
  let { editor, user, space, eventType, ...log }: AuditEvent = {
    ...JSON.parse(raw.payload),
    ...raw,
  }
  const role = log.owner ? 'owner' : log.mentor ? 'mentor' : 'founder'
  const msg = buildMsg(raw.objects)

  // prettier-ignore
  const msgs: [string | RegExp, () => JSX.Element][] = [


  /******************************************** THE MESSAGES SHOWN IN THE AUDIT TRAIL ***********************************************/
  
    // space actions
    ['create_space',                    () => msg`    ${editor} created ${space}                                                    `],
    ['create_invite_link',              () => msg`    ${editor} created an invite link for ${role}s                                 `],
    ['revoke_invite_link',              () => msg`    ${editor} revoked a ${role} invite link                                       `],
    [/upload_(cover|space)_photo/,      () => msg`    ${editor} uploaded a new ${eventType.split('_')[1]} image                     `],
    ['change_space_info', () => !log.old    ? msg`    ${editor} set ${space}'s ${log.field} to "${log.new}"                         `
                              : !log.new    ? msg`    ${editor} removed ${space}'s ${log.field}                                     `
                                            : msg`    ${editor} changed ${space}'s ${log.field} from "${log.old}" to "${log.new}"   `],
    
    // space member actions
    ['join_space',                      () => msg`    ${editor} joined ${space} as a ${role}                                        `],
    ['add_user',                        () => msg`    ${editor} added ${user} to ${space} as a ${role}                              `],
    ['change_member_role',              () => msg`    ${editor} ${cmr().verb} ${user} ${cmr().prep} ${cmr().group}                  `],
    ['remove_member', () => editor === user ? msg`    ${editor} left ${space}                                                       ` 
                                            : msg`    ${editor} removed ${user} from ${space}                                       `],
    
    // admin actions
    ['remove_account',                  () => msg`    ${editor} delted "${log.userName}"'s account                                  `],
    ['add_tag',                         () => msg`    ${editor} added <tag>${log.tag} tag to ${user}                                `],
    ['remove_tag',                      () => msg`    ${editor} removed <tag>${log.tag} tag from ${user}                            `],
    ['edit_user_info',                  () => msg`    ${editor} changed ${user}'s ${log.field} from "${log.old}" to "${log.new}"    `],
    ['set_role',                        () => msg`    ${editor} changed ${user}'s role from ${log.old} to ${log.new}                `],
    ['edit_user_info', () => !log.old       ? msg`    ${editor} set ${user}'s ${log.field} to "${log.new}"                          `
                           : !log.new       ? msg`    ${editor} removed ${user}'s ${log.field}                                      `
                                            : msg`    ${editor} changed ${user}'s ${log.field} from "${log.old}" to "${log.new}"    `],
    
    // list actions
    ['add_to_list',                     () => msg`    ${editor} added ${user} to <list>${log.list} list                             `],
    ['remove_from_list',                () => msg`    ${editor} removed ${user} from <list>${log.list} list                         `],
    
  /**********************************************************************************************************************************/


  ]

  for (const [k, v] of msgs)
    if (typeof k === 'string' ? k === eventType : k.test(eventType)) return v()

  return (
    <Message as="pre">
      {JSON.stringify(raw.payload)
        .slice(2, -2)
        .replace(/:\s*\\"/g, ': "')
        .replace(/\\"(?=,|$)/g, '"')
        .replace(/\\"/g, '')
        .replace(/,/g, '\n')
        .replace(/:\s*/g, ': ')}
    </Message>
  )

  function cmr() {
    const [verb, prep] = (log.mentor || log.owner
      ? 'added to'
      : 'removed from'
    ).split(' ')
    return { verb, prep, group: 'mentor' in log ? 'mentors' : 'owners' }
  }
}

type AuditEvent = QueryAuditTrail_audit & {
  eventType: string
  editor: string
  [k: string]: string
}
