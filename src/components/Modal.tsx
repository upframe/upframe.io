import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Shade, Title, Icon, Text } from '.'

interface Props {
  title?: string
  onClose?(): void
  text?: string
  actions?: ReactNode
  cstSize?: boolean
  onSubmit?(): void
  cancellable?: boolean
}

const Modal: React.FC<Props> = ({
  title = 'modal',
  onClose = () => {},
  text,
  actions,
  children,
  cstSize,
  onSubmit,
  cancellable = true,
}) => {
  return (
    <Shade onClick={() => cancellable && onClose?.()}>
      <S.Modal
        data-size={cstSize ? 'custom' : 'default'}
        onSubmit={e => {
          e.preventDefault()
          onSubmit?.()
        }}
        onClick={e => e.stopPropagation()}
      >
        <S.TitleRow>
          <Title size={3}>{title}</Title>
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
  Modal: styled.form`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    overflow-y: auto;
    display: block;
    box-sizing: border-box;
    background-color: #fff;
    padding: 1rem;
    border-radius: var(--border-radius);
    user-select: none;

    &[data-size='default'] {
      min-height: 10rem;
      width: 40vw;
      min-width: 30rem;
      max-width: 40rem;
      max-height: 95vh;
    }

    & > input,
    & > textarea {
      width: 100%;
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

    & > * {
      margin-right: 1rem;
    }
  `,
}

export default Object.assign(Modal, S)
