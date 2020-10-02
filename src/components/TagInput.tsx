import React from 'react'
import styled from 'styled-components'
import { Input, Chip } from '.'

export type Tag = {
  id: number
  name: string
}

interface Props {
  value: string
  onChange(v: string): void
  onTagClick?(v: Tag['id']): void
  tags?: Tag[]
  highlight?: Tag['id']
}

const TagInput: React.FunctionComponent<Props> = ({
  value,
  onChange,
  onTagClick = () => {},
  tags = [],
  highlight,
  ...props
}) => (
  <S.Input>
    <Input onChange={onChange} value={value} {...props} />
    {tags
      .map(({ id, name }) => (
        <Chip
          key={id}
          onClick={() => onTagClick(id)}
          highlight={highlight === id}
          removable
        >
          {name}
        </Chip>
      ))
      .reverse()}
  </S.Input>
)
export default TagInput

const S = {
  Input: styled.div`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding-left: 1rem;
    border-radius: var(--border-radius);
    background-color: #f1f3f4;
    overflow-x: auto;

    input {
      flex-grow: 1;
      padding-left: 0;

      &:focus,
      &:hover {
        background-color: #f1f3f4;
      }
    }

    & > div {
      margin-right: 0.5rem;
    }
  `,
}
