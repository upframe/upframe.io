import React from 'react'
import styled from 'styled-components'

const Abbr: React.FC<{ limit?: number }> = ({ limit = 20, children }) => {
  if (typeof children !== 'string') return null
  if (children.length <= limit) return <S.Abbr as="span">{children}</S.Abbr>
  return <S.Abbr title={children}>{children.slice(0, limit)}…</S.Abbr>
}

export default Abbr

const S = {
  Abbr: styled.abbr`
    font-style: italic;
    opacity: 0.7;
    text-decoration: underline dashed;
    text-underline-position: below;
    text-decoration-color: #0005;
    transition: text-decoration-color 0.1s ease;

    &:hover {
      text-decoration-color: var(--cl-primary);
    }
  `,
}
