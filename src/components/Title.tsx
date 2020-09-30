import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

interface Props {
  size?: 1 | 2 | 3 | 4 | 5 | 6
}

const Title: FunctionComponent<Props> = ({ size = 2, ...props }) => {
  const Comp = S[size] ?? BaseStyle
  return (
    <Comp {...props} as={`h${size}`}>
      {props.children}
    </Comp>
  )
}

const BaseStyle = styled.h2`
  color: var(--cl-text-strong);
`

const S = {
  1: styled(BaseStyle)`
    font-size: 2rem;
  `,
  2: styled(BaseStyle)`
    font-size: 1.5rem;
  `,
  3: styled(BaseStyle)`
    font-size: 1.25rem;
    font-weight: 500;
  `,
}
export default Object.assign(Title, { S })
