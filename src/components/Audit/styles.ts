import styled from 'styled-components'

export const Log = styled.li`
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;

  &:not(:last-child) {
    border-bottom: 1px dashed #0003;
  }
`

export const Message = styled.p`
  font-size: 1rem;
  margin: 0;

  a {
    color: var(--cl-accent);
    text-decoration: underline;
  }

  a[data-type='space'] {
    color: var(--cl-secondary);
  }
`

export const Time = styled.span`
  font-size: 0.9rem;
  margin-top: 1rem;
  white-space: pre;
`

export const Trail = styled.div``

export const List = styled.ol`
  padding: 0;
  list-style: none;
`
