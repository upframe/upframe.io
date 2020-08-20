import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Icon } from '.'
import { Link } from 'react-router-dom'
import { Conversation } from 'conversations'

export default function MsgIcon(props: any) {
  const [unread, setUnread] = useState(Conversation.staticHasUnread)

  useEffect(() => Conversation.onStatic('unread', setUnread), [])

  return (
    <S.Wrap
      to="/conversations"
      data-status={unread ? 'unread' : 'all-read'}
      {...props}
    >
      <Icon icon="message" />
    </S.Wrap>
  )
}

const S = {
  Wrap: styled(Link)`
    position: relative;
    display: block;
    line-height: 0;

    --dot-color: var(--cl-accent);

    &[data-status='unread']::after {
      --size: 0.65rem;

      content: '';
      position: absolute;
      display: block;
      width: var(--size);
      height: var(--size);
      line-height: 0;
      border-radius: 50%;
      background-color: var(--dot-color);
      bottom: calc(var(--size) / -2);
      right: 0;
      transform: translateX(50%) translateY(-50%);
      border: 1px solid #fff;
    }

    &[data-active='true'] {
      --dot-color: var(--cl-secondary);
    }
  `,
}
