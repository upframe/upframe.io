import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const getTime = () => {
  const now = new Date()
  return `${now.toLocaleDateString('en-GB', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  })} ${now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })} UTC${`+${now.getTimezoneOffset() / 60}`.replace(/\+-/, '-')}`
}

export default function VersionInfo() {
  if (window.location.host === 'upframe.io') return null

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [time, setTime] = useState(getTime)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    let toId: number
    const update = () => {
      setTime(getTime())
      toId = setTimeout(update, 1000 - (Date.now() % 1000) + 10)
    }
    update()
    return () => clearTimeout(toId)
  }, [])

  return (
    <S.Info>
      {process.env.COMMIT}
      <br />
      {time}
      <br />
      {window.location.host}
      <br />
      {process.env.BRANCH}
    </S.Info>
  )
}

const S = {
  Info: styled.pre`
    position: fixed;
    right: 0;
    top: 0;
    padding: 5px 10px;
    z-index: 11000;
    margin: 0;
    pointer-events: none;
    font-size: 9px;
    color: #000a;
    text-shadow: 0 0 2px #fff;
    font-weight: 700;
    text-align: right;
  `,
}
