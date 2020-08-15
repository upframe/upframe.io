import React from 'react'
import styled from 'styled-components'
import { Title, Text, ListCard } from '../../components'
import { gql, useQuery } from 'gql'
import type { Lists } from 'gql/types'

const LISTS = gql`
  query Lists {
    lists {
      id
      name
      illustration
      backgroundColor
      textColor
    }
  }
`

export default function Categories() {
  const { data: { lists = [] } = {} } = useQuery<Lists>(LISTS)
  let repeat = parseInt(
    new URLSearchParams(window.location.search).get('listRepeat') ?? '1'
  )

  return (
    <>
      <Title size={2}>Top Categories</Title>
      <Text>How can we help? Start by picking one of our main categories.</Text>
      <S.Lists>
        {Array<typeof lists>(repeat)
          .fill(lists)
          .flatMap((lists, i) =>
            lists.map(list => <ListCard key={`${list.id}-${i}`} list={list} />)
          )}
      </S.Lists>
    </>
  )
}

const S = {
  Lists: styled.div`
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    height: calc(var(--list-width) * 0.34);
    box-sizing: border-box;
    width: 100vw;
    scroll-snap-type: x mandatory;

    --padding: 15vw;

    margin-left: calc(var(--padding) * -1);
    padding-left: var(--padding);
    scroll-padding: var(--padding);

    @media (max-width: 1020px) {
      --padding: calc((100vw - 55rem) / 2);
    }

    @media (max-width: 57.75rem) {
      --padding: 2.5vw;
    }
  `,
}
