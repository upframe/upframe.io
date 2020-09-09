import React, { useState } from 'react'
import styled from 'styled-components'
import Icon from './Icon'

export default function UpdatePrompt() {
  const [hidden, setHidden] = useState(false)

  if (hidden) return null
  return (
    <S.Prompt>
      <S.Text>
        <span>A new version of Upframe is available. </span>
        <span>Reload the page to see the latest version.</span>
      </S.Text>
      <S.Actions>
        <Icon icon="refresh" onClick={() => window.location.reload()} />
        <Icon icon="close" onClick={() => setHidden(true)} />
      </S.Actions>
    </S.Prompt>
  )
}

const S = {
  Prompt: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    background-color: #333;
    max-width: 100vw;
    max-width: min(30rem, 100vw);
    box-sizing: border-box;
    padding: 0.8rem 1.5rem;
    padding-right: 1rem;
  `,

  Text: styled.p`
    display: block;
    flex-grow: 1;
    margin: 0;
    font-size: 1rem;
    color: #fffe;

    span {
      display: inline-block;
    }
  `,

  Actions: styled.div`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    fill: #fffe;

    svg:last-of-type {
      margin-left: 0.5rem;
    }
  `,
}
