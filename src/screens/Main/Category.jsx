import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Category = ({ name, pictureUrl, backgroundColor, textColor }) => {
  return (
    <Container
      to={`/list/${name}`}
      style={{
        backgroundColor,
        backgroundImage: `url(${pictureUrl})`,
        color: `${textColor}`,
      }}
    >
      <Span>{name}</Span>
    </Container>
  )
}
const Container = styled(Link)`
  flex-shrink: 0;
  margin-left: 20px;
  display: block;
  box-sizing: border-box;
  width: 28rem;
  height: 10rem;
  max-width: 100%;
  background-color: #1b3371;
  border-radius: var(--border-radius);
  margin-top: 1.25rem;
  margin-right: 1.25rem;
  margin-bottom: 1.25rem;
  background-position: bottom right;
  background-size: 10rem;
  background-repeat: no-repeat;
  scroll-snap-align: center;
  transition: transform ease 0.125s;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    transform: scale(1.0525);

    @media (max-width: 1020px) {
      scroll-snap-align: center;
      width: 35%;
      flex-direction: row;
    }
  }
`
const Span = styled.span`
  display: block;
  font-size: 1.2rem;
  line-height: 2rem;
  width: 15rem;
  padding-top: 1rem;
  padding-left: 1rem;
  font-weight: bold;
  text-decoration: none;
  text-transform: capitalize;
`
export default Category
