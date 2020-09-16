import React from 'react'
import styled from 'styled-components'

interface Props {
  totalRows: number
}

function PaginationInterface({ totalRows }: Props) {
  return (
    <S.Wrap>
      <span>{totalRows} Results</span>
    </S.Wrap>
  )
}

const S = {
  Wrap: styled.div`
    display: flex;
    height: 2rem;
    height: min(2rem, 100%);
    align-items: center;
  `,
}

export default Object.assign(PaginationInterface, { sc: S.Wrap })
