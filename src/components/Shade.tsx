import React from 'react'
import styled from 'styled-components'

interface Props {
  onClick?(): void
}

const Shade: React.FC<Props> = ({ children, onClick = () => {} }) => (
  <S.Shade onClick={onClick}>{children}</S.Shade>
)

const S = {
  Shade: styled.div`
    position: fixed;
    display: block;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 3000;
    background-color: #0008;

    @supports (backdrop-filter: blur(5px)) {
      background-color: #0002;
      backdrop-filter: blur(5px);
    }
  `,
}

export default Shade
