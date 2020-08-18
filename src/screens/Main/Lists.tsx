import React, { useState, useEffect, useRef, MutableRefObject } from 'react'
import styled from 'styled-components'
import { Title, Text, ListCard } from '../../components'
import { queries, useQuery } from 'gql'
import type { Lists } from 'gql/types'
import { useMatchMedia } from 'utils/hooks'

export default function Categories() {
  const { data: { lists = [] } = {} } = useQuery<Lists>(queries.LISTS)
  let repeat = parseInt(
    new URLSearchParams(window.location.search).get('listRepeat') ?? '1'
  )
  const ref = useRef() as MutableRefObject<HTMLDivElement>
  const isTouch = useMatchMedia('(hover: none), (pointer: coarse)')
  const isWindows = navigator.platform.startsWith('Win')
  const [scrollbar, setScrollbar] = useState(
    isWindows ? 'mod hidden' : 'default'
  )

  useEffect(() => {
    const el = ref.current
    if (!el || isTouch) return
    let scrollSnapType = (el.style as any).scrollSnapType
    let hasScrolled = false
    let scrollbarSet = false
    let tdId: number

    function handleMouseDown(e: MouseEvent) {
      e.preventDefault()
      window.addEventListener('mousemove', handleDrag)
      hasScrolled = false
      scrollbarSet = false
    }

    function stopListen(e: MouseEvent) {
      e?.preventDefault()
      window.removeEventListener('mousemove', handleDrag)
      const left =
        el.getBoundingClientRect().left +
        parseFloat(getComputedStyle(el).getPropertyValue('padding-left'))
      const dist = (Array.from(el.childNodes) as HTMLElement[]).map(
        node => node.getBoundingClientRect().left - left
      )
      const distAbs = dist.map(v => Math.abs(v))
      const closest = dist[distAbs.indexOf(Math.min(...distAbs))]
      el.scrollBy({ left: closest, behavior: 'smooth' })
      setTimeout(() => {
        ;(el.style as any).scrollSnapType = scrollSnapType
      }, 200)

      if (hasScrolled)
        (Array.from(el.childNodes) as HTMLElement[]).forEach(node => {
          node.style.pointerEvents = 'initial'
        })
    }

    function handleDrag(e: MouseEvent) {
      ;(el.style as any).scrollSnapType = 'none'
      el?.scrollBy({ left: -e.movementX })
      if (isWindows) {
        if (!scrollbarSet) {
          setScrollbar('mod')
          scrollbarSet = true
        }
        clearTimeout(tdId)
        tdId = setTimeout(() => {
          setScrollbar('mod hidden')
          scrollbarSet = false
        }, 700)
      }
      if (hasScrolled) return
      hasScrolled = true
      ;(Array.from(el.childNodes) as HTMLElement[]).forEach(node => {
        node.style.pointerEvents = 'none'
      })
    }

    el.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', stopListen)
    window.addEventListener('mouseleave', stopListen)
    return () => {
      el.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleDrag)
      window.removeEventListener('mouseup', stopListen)
      window.removeEventListener('mouseleave', stopListen)
    }
  }, [ref, isTouch, isWindows])

  return (
    <>
      <Title size={2}>Top Categories</Title>
      <Text>How can we help? Start by picking one of our main categories.</Text>
      <S.Lists
        ref={ref}
        {...(scrollbar !== 'default' && { 'data-scrollbar': scrollbar })}
      >
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
    --padding-side: 15vw;
    --padding-vert: 1rem;
    --scrollbar-size: 6px;

    display: flex;
    flex-direction: row;
    height: calc(var(--list-width) * 0.34 + var(--padding-vert) * 2);
    box-sizing: border-box;
    width: 100vw;
    scroll-snap-type: x mandatory;
    margin-left: calc(var(--padding-side) * -1);
    padding-left: var(--padding-side);
    scroll-padding: var(--padding-side);
    padding-top: var(--padding-vert);
    padding-bottom: var(--padding-vert);
    overflow-x: auto;
    overflow-x: overlay;

    &[data-scrollbar]::-webkit-scrollbar {
      width: var(--scrollbar-size);
      height: var(--scrollbar-size);
      background-color: transparent;
    }

    &[data-scrollbar]::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &[data-scrollbar]::-webkit-scrollbar-thumb {
      border-radius: calc(var(--scrollbar-size) / 2);
      background-color: #aaa;
    }

    &[data-scrollbar~='hidden']::-webkit-scrollbar-thumb:not(:hover) {
      background-color: transparent;
    }

    @media (max-width: 1020px) {
      --padding-side: calc((100vw - 55rem) / 2);
    }

    @media (max-width: 57.75rem) {
      --padding-side: 2.5vw;
    }
  `,
}
