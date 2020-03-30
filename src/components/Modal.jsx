import React from 'react'
import styled from 'styled-components'
import { Shade, Title, Icon, Text } from '.'

export default function Modal({
  title = 'modal',
  onClose = () => {},
  text,
  actions,
  children,
  cstSize,
}) {
  return (
    <Shade>
      <S.Modal data-size={cstSize ? 'custom' : 'default'}>
        <S.TitleRow>
          <Title s3>{title}</Title>
          <Icon icon="close" onClick={onClose} />
        </S.TitleRow>
        {!!text && <Text>{text}</Text>}
        {children}
        {!!actions && <S.Actions>{actions}</S.Actions>}
      </S.Modal>
    </Shade>
  )
}

const S = {
  Modal: styled.div`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    overflow-y: auto;
    display: block;
    box-sizing: border-box;
    background-color: #fff;
    padding: 1rem;
    border-radius: 0.5rem;
    user-select: none;

    &[data-size='default'] {
      min-height: 10rem;
      width: 40vw;
      min-width: 30rem;
      max-width: 40rem;
      max-height: 95vh;
    }
  `,

  TitleRow: styled.div`
    display: flex;
    justify-content: space-between;

    h3 {
      margin-top: 0;
      color: #000;
    }
  `,

  Actions: styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 2.5rem;
  `,
}
