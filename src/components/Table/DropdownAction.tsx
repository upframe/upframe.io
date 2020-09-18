import React from 'react'
import styled from 'styled-components'
import * as styles from './styles'
import { Icon } from 'components'

interface Props {
  dropdown: Element | JSX.Element
}

const DropdownAction: React.FunctionComponent<Props> = ({
  children,
  dropdown,
}) => {
  return (
    <S.NavItem
      aria-expanded={false}
      onClick={({ currentTarget }) => {
        const gp = currentTarget.parentElement?.parentElement
        if (!gp) return
        Array.from(gp.querySelectorAll('[aria-expanded]')).forEach(el => {
          if (el !== currentTarget)
            (el as HTMLElement).setAttribute('aria-expanded', 'false')
        })
        currentTarget.setAttribute(
          'aria-expanded',
          (currentTarget.getAttribute('aria-expanded') === 'false').toString()
        )
      }}
    >
      {children}
      <S.Dropdown onClick={e => e.stopPropagation()}>
        {dropdown}
        <S.Close>
          <Icon
            icon="close"
            clickStyle={false}
            onClick={({ currentTarget }) =>
              currentTarget.parentElement?.parentElement?.parentElement?.click()
            }
          />
        </S.Close>
      </S.Dropdown>
    </S.NavItem>
  )
}

export default DropdownAction

const S = {
  ...styles,

  Dropdown: styled.div`
    display: none;
    position: absolute;
    left: 0;
    top: 100%;
    box-shadow: 0 0 2px 1px #0005;
    background-color: #fff;
    z-index: 10;
    min-width: 15rem;
    cursor: default;

    * [aria-expanded='true'] > & {
      display: block;
    }
  `,

  Close: styled.div`
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    cursor: pointer;
  `,
}
