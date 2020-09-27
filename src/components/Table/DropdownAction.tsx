import React, { useState } from 'react'
import styled from 'styled-components'
import * as styles from './styles'
import { Icon } from 'components'
import { useClickOutHide } from 'utils/hooks'

interface Props {
  dropdown: Element | JSX.Element
}

const DropdownAction: React.FunctionComponent<Props> = ({
  children,
  dropdown,
}) => {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <S.NavItem
      aria-expanded={false}
      onClick={() => {
        if (!showDropdown) setShowDropdown(true)
      }}
    >
      {children}
      {showDropdown && (
        <Dropdown dropdown={dropdown} onHide={() => setShowDropdown(false)} />
      )}
    </S.NavItem>
  )
}

function Dropdown({ dropdown, onHide }: Props & { onHide(): void }) {
  useClickOutHide(S.Dropdown.styledComponentId, onHide, true)

  return (
    <S.Dropdown>
      {dropdown}
      <S.Close>
        <Icon icon="close" clickStyle={false} onClick={onHide} />
      </S.Close>
    </S.Dropdown>
  )
}

export default DropdownAction

const S = {
  ...styles,

  Dropdown: styled.div`
    position: absolute;
    left: 0;
    top: 100%;
    box-shadow: 0 0 2px 1px #0005;
    background-color: #fff;
    z-index: 10;
    min-width: 15rem;
    cursor: default;
    z-index: 1001;
  `,

  Close: styled.div`
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    cursor: pointer;
  `,
}
