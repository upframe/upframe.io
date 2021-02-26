import React, { useRef, useState } from 'react'
import { useDetectClickOutside } from 'utils/hooks'
import Icon from './Icon'
import styled from 'styled-components'

interface Props {
  values: Array<string>
  onSelect(value: string): void
  selectedValue?: string
}

export default function Dropdown({ values, onSelect, selectedValue }: Props) {
  const [valuesVisible, setValuesVisible] = useState(false)
  const valuesRef = useRef(null)
  useDetectClickOutside(valuesRef, () => setValuesVisible(false))

  return (
    <Style.DropDownContainer ref={valuesRef}>
      <Style.DropDownHeader onClick={() => setValuesVisible(!valuesVisible)}>
        {selectedValue}
        <Icon color="rgba(0, 0, 0, 0.46)" icon="drop_down_arrow" />
      </Style.DropDownHeader>
      {valuesVisible && (
        <Style.DropDownValuesContainer>
          {values.map(value => (
            <Style.DropDownValue
              selected={selectedValue === value}
              key={value}
              onClick={() => {
                onSelect(value)
                setValuesVisible(false)
              }}
            >
              {value}
            </Style.DropDownValue>
          ))}
        </Style.DropDownValuesContainer>
      )}
    </Style.DropDownContainer>
  )
}

const Style = {
  DropDownContainer: styled.div`
    align-self: flex-start;
    position: relative;
    color: rgba(0, 0, 0, 0.46);
    margin-bottom: 35px;
    box-sizing: border-box;
    width: 115px;
  `,
  DropDownHeader: styled.div`
    padding: 12px 8px 6px 2px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 20px;
    width: fit-content;

    &:hover {
      cursor: pointer;
    }

    & > svg {
      margin-left: 7px;
    }
  `,
  DropDownValuesContainer: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    position: absolute;
    top: 38px;
    left: 0;
    z-index: 999;
    width: 115px;
    background-color: white;
  `,
  DropDownValue: styled.span<{ selected: boolean }>`
    padding: 6px 0 6px 2px;
    color: rgba(0, 0, 0, 0.46);
    width: 100%;
    cursor: pointer;

    &:hover {
      background-color: #f1f3f4;
    }

    ${({ selected }) =>
      selected &&
      `
      color: var(--cl-accent);
    `}
  `,
}
