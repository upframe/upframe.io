import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { parseSize } from '../utils/css'

interface Props {
  itemHeight: string
  children: React.ReactElement[]
}

const Scroller: React.FunctionComponent<Props> = ({ children, itemHeight }) => {
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>
  const [height, setHeight] = useState<number>()
  const [itemPx, setItemPx] = useState(0)
  const [limit, setLimit] = useState(0)
  const [skip, setSkip] = useState(0)

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

  return (
    <S.Scroller
      ref={ref}
      itemHeight={itemHeight}
      offTop={skip}
      offBottom={children.length - limit - skip}
    >
      {limit && [...children].slice(skip, skip + limit)}
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

    & > *:first-child {
      margin-top: var(--padd-top);
    }

    & > *:last-child {
      margin-bottom: var(--padd-bottom);
    }
  `,
}
export default Object.assign(Scroller, { sc: S.Scroller })
