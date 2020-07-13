import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Icon } from 'components'

interface Props {
  id: string
  onToggle(v: boolean): void
  i?: number
}

function MsgContext({ id, onToggle, i }: Props) {
  const [showMenu, setShowMenu] = useState(false)

  function toggle() {
    setShowMenu(!showMenu)
    onToggle(!showMenu)
  }

  return (
    <S.ContextIcon>
      <Icon icon="more" onClick={toggle} />
      {showMenu && <Menu id={id} onToggle={toggle} i={i} />}
    </S.ContextIcon>
  )
}

function Menu({ id, onToggle, i }: Props) {
  useEffect(() => {
    if (!onToggle) return
    function onClick() {
      onToggle(false)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [onToggle])

  return (
    <S.Menu onClick={e => e.stopPropagation()}>
      <span>{id}</span>
      <span>{i}</span>
    </S.Menu>
  )
}

const S = {
  ContextIcon: styled.div`
    position: absolute;
    right: 0.4rem;
    top: 0.3rem;
    width: 1.2rem;
    height: 1.2rem;
    display: none;

    svg {
      width: 100%;
      height: 100%;
      opacity: 0.6;
    }
  `,

  Menu: styled.div`
    position: absolute;
    right: 2rem;
    top: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background-color: #fff;
    border: 1px solid #e5e5e5;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
    border-radius: 0.5rem;

    span {
      font-size: 0.8rem;
    }
  `,
}

export default Object.assign(MsgContext, { sc: S.ContextIcon })
