import React, { useState, useEffect } from 'react'
import MentorList from '../Main/MentorList'
import type { SpacePage } from 'gql/types'

interface Props {
  mentors: Exclude<SpacePage['space'], null>['mentors']
}

export default function Mentors(props: Props) {
  const [mentors, setMentors] = useState<Props['mentors']>([])

  useEffect(() => {
    if (!props.mentors?.length) return
    const spaceMentors = [...props.mentors]
    const _mentors: any[] = []
    while (spaceMentors.length) {
      const mentor = spaceMentors.splice(
        (Math.random() * spaceMentors.length) | 0,
        1
      )[0]
      const pos = Math.min(
        _mentors.findIndex(
          ({ sortScore }) => sortScore >= (mentor.sortScore ?? 0)
        ) + 1,
        _mentors.length
      )
      _mentors.splice(pos, 0, mentor)
    }
    setMentors(_mentors ?? [])
  }, [props.mentors])

  return <MentorList mentors={mentors} />
}
