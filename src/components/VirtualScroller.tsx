import React, { useState, useEffect, useRef, useReducer } from 'react'
import styled from 'styled-components'
import { parseSize } from '../utils/css'

interface Props {
  itemHeight: string
  Child(...args: any[]): JSX.Element
  props(index: number): any
  numChildren: number
}

function load(
  state: ReturnType<Props['Child']>[],
  {
    skip,
    limit,
    Child,
    props,
  }: { skip: number; limit: number } & Omit<Props, 'itemHeight' | 'numChildren'>
): ReturnType<Props['Child']>[] {
  if (state.length) {
    const firstKey = parseInt(state[0].key as string)
    const lastKey = parseInt(state[state.length - 1].key as string)
    if (skip > firstKey && skip <= lastKey) {
      const ind = state.findIndex(v => parseInt(v.key as string) === skip)
      return [
        ...state.slice(ind),
        ...Array(ind)
          .fill(0)
          .map((_, i) => (
            <Child
              key={skip + i + (state.length - ind)}
              {...props(skip + i + (state.length - ind))}
            />
          )),
      ]
    }
    if (skip < firstKey && firstKey - skip < state.length - 1) {
      const ind = state.findIndex(
        v => parseInt(v.key as string) === skip + state.length
      )
      return [
        ...Array(state.length - ind)
          .fill(0)
          .map((_, i) => <Child key={skip + i} {...props(skip + i)} />),
        ...state.slice(0, ind),
      ]
    }
  }
  return Array(limit)
    .fill(0)
    .map((_, i) => <Child key={skip + i} {...props(skip + i)} />)
}

const Scroller: React.FunctionComponent<Props> = ({
  itemHeight,
  Child,
  props,
  numChildren,
}) => {
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>
  const [height, setHeight] = useState<number>()
  const [itemPx, setItemPx] = useState(0)
  const [limit, setLimit] = useState(0)
  const [skip, setSkip] = useReducer(
    (_, v) => Math.min(v, numChildren - limit),
    0
  )
  const [children, loadChildren] = useReducer(
    load,
    [] as ReturnType<Props['Child']>[]
  )

  useEffect(() => {
    const scroller = ref.current

    if (!scroller) return
    setHeight(scroller.offsetHeight)

    function onScroll() {
      const skip = (scroller.scrollTop / itemPx) | 0
      setSkip(skip)
    }

    scroller.addEventListener('scroll', onScroll)
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [ref, itemPx])

  useEffect(() => {
    if (!height) return
    const heightPx = parseSize(itemHeight)
    setItemPx(heightPx)
    setLimit(Math.ceil(height / heightPx) + 1)
  }, [height, itemHeight])

  useEffect(() => {
    loadChildren({ skip, limit, Child, props })
  }, [limit, Child, props, skip])

  return (
    <S.Scroller
      ref={ref}
      itemHeight={itemHeight}
      offTop={skip}
      offBottom={numChildren - limit - skip}
    >
      {children}
    </S.Scroller>
  )
}

interface ScScrollProps {
  itemHeight: string
  offTop: number
  offBottom: number
}

const S = {
  Scroller: styled.div.attrs((p: ScScrollProps) => ({
    style: {
      '--padd-top': `calc(${p.itemHeight} * ${p.offTop})`,
      '--padd-bottom': `calc(${p.itemHeight} * ${p.offBottom})`,
    },
  }))<ScScrollProps>`
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    width: 30rem;
    margin: auto;
    height: 70vh;
    overflow-y: auto;

    & > * {
      transform: translateY(var(--padd-top));
    }

    & > *:last-child {
      margin-bottom: var(--padd-bottom);
    }
  `,
}
export default Object.assign(Scroller, { sc: S.Scroller })
