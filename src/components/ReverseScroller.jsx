import React from 'react'
import styled from 'styled-components'

function ReverseScroller({ children }) {
  return (
    <S.Scroller
      {...(navigator.userAgent.toLowerCase().includes('firefox') && {
        'data-browser': 'firefox',
      })}
    >
      {Array.isArray(children) ? [...children].reverse() : children}
    </S.Scroller>
  )
}

const S = {
  Scroller: styled.div`
    display: flex;
    flex-direction: column-reverse;

    /* patch for firefox reverse flex scroll bug https://bugzilla.mozilla.org/show_bug.cgi?id=1042151
    ...that still hasn't been fixed after 6 years */
    &[data-browser='firefox'] {
      flex-direction: column;
      transform: rotate(180deg);
      direction: rtl;

      & > * {
        transform: rotate(180deg);
      }

      * {
        text-align: left;
        flex-direction: row-reverse;
      }
    }
  `,
}

export default Object.assign(ReverseScroller, S)
