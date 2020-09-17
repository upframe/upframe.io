import React from 'react'
import styled from 'styled-components'
import * as styles from './styles'
import { Icon } from 'components'

interface Props {
  fullscreen: boolean
  setFullscreen(v: boolean): void
}

export default function FullscreenToggle({ fullscreen, setFullscreen }: Props) {
  return (
    <S.NavItem onClick={() => setFullscreen(!fullscreen)}>
      <S.Toggle>
        <Icon icon={fullscreen ? 'minimize' : 'maximize'} />
      </S.Toggle>
    </S.NavItem>
  )
}

const S = {
  ...styles,

  Toggle: styled.div`
    display: contents;

    svg {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: scale(1) translateX(-50%) translateY(-50%);
    }
  `,
}
