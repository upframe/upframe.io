import React from 'react'
import styled from 'styled-components'

function ReverseScroller({ children }) {
  return (
    <S.Scroller>
      {Array.isArray(children) ? [...children].reverse() : children}
    </S.Scroller>
  )
}

const S = {
  Scroller: styled.div`
    display: flex;
    flex-direction: column-reverse;
  `,
}

export default Object.assign(ReverseScroller, S)
