import React from 'react'
import styled from 'styled-components'
import { AuditTrail } from 'components'

export default function Audit() {
  return (
    <S.Wrap>
      <AuditTrail trailId="admin_edits" />
    </S.Wrap>
  )
}

const S = {
  Wrap: styled.div`
    padding-left: 5vw;
  `,
}
