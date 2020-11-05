import React from 'react'
import styled from 'styled-components'
import { useClickOutHide } from 'utils/hooks'

interface Props {
  onClick?(k: string): void
  onClose(): void
}

const Dropdown: React.FC<Props> = ({ children, onClick, onClose }) => {
  if (!Array.isArray(children)) children = [children]
  useClickOutHide(S.Dropdown, onClose)

  return (
    <S.Dropdown>
      {(children as any[]).map(child => (
        <S.Item
          key={child.key}
          {...(onClick && {
            onClick() {
              onClick(child.key)
            },
          })}
        >
          {child}
        </S.Item>
      ))}
    </S.Dropdown>
  )
}

const S = {
  Dropdown: styled.ol`
    position: absolute;
    z-index: 600;
    left: 0;
    top: 100%;
    background-color: #fff;
    box-shadow: 0 2px 6px #0004;
    list-style: none;
    width: 15rem;
    border-radius: 0.5rem;
    padding: 0;
  `,

  Item: styled.li`
    padding: 1rem;
    cursor: pointer;

    &:not(:first-of-type) {
      padding-top: 0.5rem;
    }

    &:not(:last-of-type) {
      padding-bottom: 0.5rem;
    }

    &:hover {
      background-color: #eeeb;
    }
  `,
}
export default Object.assign(Dropdown, S)
