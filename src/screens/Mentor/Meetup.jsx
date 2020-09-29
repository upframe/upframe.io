import React, { useState, useEffect, useRef, createRef } from 'react'
import styles from './profile.module.scss'
import { Card, Title } from '../../components'
import Slot from './Slot'
import { useDetectClickOutside } from 'utils/hooks'
import Conversation from 'conversations/conversation'
import styled from 'styled-components'
import Icon from '../../components/Icon'
import useResizeObserver from 'use-resize-observer'
import { InView } from 'react-intersection-observer'
import Request from './Request'
import { ordNum } from '../../utils/date'

const phUrl = 'https://www.producthunt.com/upcoming/upframe'

const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const Divider = () => (
  <Style.Divider>
    <Style.Line />
    <Style.Triangle />
    <Style.Line />
  </Style.Divider>
)

const Day = ({ date, day, onClick, disabled, selected, propRef }) => (
  <Style.Day
    ref={propRef}
    disabled={disabled}
    selected={selected}
    onClick={disabled ? undefined : onClick}
  >
    <span>{date}</span>
    <span>{WEEK_DAYS[day].slice(0, 3)}</span>
  </Style.Day>
)

const DropDown = ({ values, onSelect, selectedValue }) => {
  const [valuesVisible, setValuesVisible] = useState(false)
  const valuesRef = useRef(null)
  useDetectClickOutside(valuesRef, () => setValuesVisible(false))

  return (
    <Style.DropDownContainer>
      <Style.DropDownHeader onClick={() => setValuesVisible(!valuesVisible)}>
        {selectedValue}
        <Icon color={'rgba(0, 0, 0, 0.46)'} icon="drop_down_arrow" />
      </Style.DropDownHeader>
      {valuesVisible && (
        <Style.DropDownValuesContainer ref={valuesRef}>
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

const getHighestMonth = (slotDays, elInViewport) => {
  const monthCounter = Object.entries(
    slotDays
      .filter((_, index) => elInViewport[index])
      .reduce((acc, curVal) => {
        const tempDate = new Date(curVal[0])
        const month = tempDate.getMonth()
        if (Object.prototype.hasOwnProperty.call(acc, month))
          acc[`${month}`] = acc[`${month}`] + 1
        else acc[`${month}`] = 1

        return acc
      }, {})
  ).sort((a, b) => b[1] - a[1])
  return MONTHS[monthCounter[0][0]]
}

const getSlotDayDate = dateString => {
  const d = new Date(dateString)
  return `${WEEK_DAYS[d.getDay()]}, ${ordNum(d.getDate())} of ${
    MONTHS[d.getMonth()]
  }`
}

const getDaysArray = (slots, minDays) => {
  let slotsByDates
  if (!slots.length) {
    const curDate = new Date()
    slotsByDates = [...Array(minDays).keys()].reduce((acc, curVal) => {
      curDate.setDate(curDate.getDate() + curVal)
      acc.set(`${curDate}`, [])
      return acc
    }, new Map())
  } else {
    slotsByDates = slots.reduce((acc, curVal) => {
      const tempDate = new Date(curVal.start)
      const dateOnlyDate = new Date(
        tempDate.getFullYear(),
        tempDate.getMonth(),
        tempDate.getDate()
      ).toDateString()

      if (acc.has(`${dateOnlyDate}`)) {
        acc.set(`${dateOnlyDate}`, [...acc.get(`${dateOnlyDate}`), curVal])
      } else {
        acc.set(`${dateOnlyDate}`, [curVal])
      }

      return acc
    }, new Map())

    const dates = [...slotsByDates.keys()].sort(
      (a, b) => new Date(a) - new Date(b)
    )
    let index = 0
    let curDate = dates[0]
    const lastDate = dates[dates.length - 1]
    while (
      (new Date(curDate) <= new Date(lastDate) ||
        slotsByDates.size < minDays) &&
      index < 100
    ) {
      if (!slotsByDates.has(curDate)) {
        slotsByDates.set(curDate, [])
      }
      const tempDate = new Date(curDate)

      tempDate.setDate(tempDate.getDate() + 1)

      curDate = tempDate.toDateString()
      index++
    }
  }
  return [...slotsByDates.entries()].sort(
    (a, b) => new Date(a[0]) - new Date(b[0])
  )
}

export default function Meetup({ mentor }) {
  const { ref } = useResizeObserver({
    onResize: ({ width }) => {
      setMaxItems(Math.floor(width / 87))
    },
  })

  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedDay, setSelectedDay] = useState(-1)
  const [_, setConId] = useState()
  const [maxItems, setMaxItems] = useState(0)
  const [slotDays, setSlotDays] = useState(
    getDaysArray(mentor.slots || [], maxItems)
  )
  const elRefs = useRef([])
  const [elInViewport, setElInViewport] = useState(
    [...Array(slotDays.length).keys()].map((_, index) => index <= maxItems)
  )
  const [months, setMonths] = useState([])
  const [curMonth, setCurMonth] = useState(null)

  if (elRefs.current.length !== slotDays.length) {
    elRefs.current = Array(slotDays.length)
      .fill()
      .map((_, i) => elRefs.current[i] || createRef())
  }
  const containerRef = useRef(null)

  const scrollToDay = (index, dir = 'right') => {
    if (containerRef.current) {
      if (index < 0)
        containerRef.current.scrollTo(elRefs.current[0].current.x, 0)
      else if (index > elRefs.current.length - 1)
        containerRef.current.scrollTo(
          elRefs.current[elRefs.length - 1].current.x,
          0
        )
      else if (elRefs.current[index].current)
        containerRef.current.scrollTo(
          elRefs.current[index].current.offsetLeft,
          0
        )
    }
  }

  useEffect(() => {
    const handleScroll = () =>
      setCurMonth(getHighestMonth(slotDays, elInViewport))

    if (containerRef.current) {
      const node = containerRef.current
      node.addEventListener('scroll', handleScroll)
      return () => node.removeEventListener('scroll', handleScroll)
    }
  }, [slotDays, elInViewport])

  useEffect(() => {
    if (ref.current) {
      const newMaxItems = Math.floor(
        ref.current.offsetWidth / 87 /* width + margin of day element */
      )
      setMaxItems(newMaxItems)
      const sbd = getDaysArray(mentor.slots || [], newMaxItems)
      setSlotDays(sbd)
      setElInViewport(elInViewport.map((_, index) => index <= newMaxItems))
      const newAllMonths = sbd
        .reduce((acc, curVal) => {
          const tempDate = new Date(curVal)
          const month = tempDate.getMonth()
          if (month && acc.findIndex(el => el === month) === -1) acc.push(month)
          return acc
        }, [])
        .map(el => MONTHS[el])
      setMonths(newAllMonths)
      setCurMonth(getHighestMonth(slotDays, elInViewport))
    }
  }, [maxItems, elInViewport, mentor.slots, ref, slotDays])

  useEffect(() => {
    setConId(Conversation.getByUsers([mentor.id])?.id)
    Conversation.onStatic('added', () =>
      setConId(Conversation.getByUsers([mentor.id])?.id)
    )
  }, [mentor.id])
  return (
    <Card className={styles.meetup}>
      <Title size={3}>Send me a message or schedule a meetup</Title>
      <DropDown
        values={months}
        selectedValue={curMonth}
        onSelect={newMonthIndex => {
          const newMonth = months[months.findIndex(m => m === newMonthIndex)]
          setCurMonth(newMonth)
          const indexOfFirstMonth = slotDays.findIndex(el => {
            const tempDate = new Date(el[0])
            return newMonth === MONTHS[tempDate.getMonth()]
          })
          scrollToDay(indexOfFirstMonth)
        }}
      />
      <Style.DayContainer ref={ref}>
        <Icon
          color={elInViewport[0] === 0 ? '#B4B4B4' : '#8B8B8B'}
          onClick={
            elInViewport[0]
              ? undefined
              : () => scrollToDay(elInViewport.findIndex(el => el) - maxItems)
          }
          icon="angle_left"
        />
        <Style.ScrollView ref={containerRef}>
          {slotDays.map((slotsByDay, index) => {
            return (
              <InView
                key={index}
                as="div"
                onChange={(inView, entry) => {
                  setElInViewport(
                    elInViewport.map((el, ind) => (ind === index ? inView : el))
                  )
                }}
              >
                <Day
                  propRef={elRefs.current[index]}
                  day={new Date(slotsByDay[0]).getDay()}
                  date={new Date(slotsByDay[0]).getDate()}
                  onClick={async () => {
                    setSelectedDay(index)
                    setSelectedSlot(null)
                    await setTimeout(
                      () =>
                        window.scrollTo({
                          left: 0,
                          top: document.body.scrollHeight,
                          behavior: 'smooth',
                        }),
                      200
                    )
                  }}
                  disabled={!slotsByDay[1].length}
                  selected={index === selectedDay}
                />
              </InView>
            )
          })}
        </Style.ScrollView>
        <Icon
          color={maxItems !== slotDays.length ? '#8B8B8B' : '#B4B4B4'}
          onClick={
            elInViewport[elInViewport.length - 1]
              ? undefined
              : () =>
                  scrollToDay(elInViewport.findIndex(el => el) + maxItems - 1)
          }
          icon="angle_right"
        />
      </Style.DayContainer>
      {selectedDay >= 0 && (
        <>
          <Divider />
          <Style.Time>{`${getSlotDayDate(
            slotDays[selectedDay][0]
          )}`}</Style.Time>
          <Style.Slots>
            <>
              {slotDays[selectedDay][1]
                .sort((a, b) => new Date(a.start) - new Date(b.start))
                .map(slot => (
                  <Slot
                    selected={selectedSlot && slot.start === selectedSlot.start}
                    key={slot.start}
                    start={slot.start}
                    onClick={async () => {
                      setSelectedSlot(slot)
                      await setTimeout(
                        () =>
                          window.scrollTo({
                            left: 0,
                            top: document.body.scrollHeight,
                            behavior: 'smooth',
                          }),
                        200
                      )
                    }}
                  />
                ))}
            </>
          </Style.Slots>
        </>
      )}
      {selectedSlot && (
        <>
          <Divider />
          <Request slot={selectedSlot} />
        </>
      )}
    </Card>
  )
}

const Style = {
  Day: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    font-weight: bold;
    align-items: center;
    height: 100px;
    min-width: 75px;
    border-radius: 15px;
    background-color: #feeef2;
    color: var(--cl-accent);

    ${({ selected }) =>
      selected &&
      `
      background-color: var(--cl-accent);
      color: white;
    `}
    ${({ disabled }) =>
      disabled &&
      `
      background-color: white;
      color: grey;
    `}
    
    &:hover {
      cursor: pointer;
    }
  `,
  ScrollView: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    overflow: auto;
    width: 100%;

    & > div:not(:last-child) {
      margin-right: 12px;
    }
  `,
  DayContainer: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `,
  Divider: styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    margin: 30px 0;
    justify-content: space-evenly;
    align-items: center;
  `,
  Triangle: styled.span`
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid var(--cl-accent);
    margin: 0 32px;
  `,
  Line: styled.span`
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  `,
  DropDownContainer: styled.div`
    align-self: flex-start;
    position: relative;
    color: rgba(0, 0, 0, 0.46);
    margin-bottom: 35px;
  `,
  DropDownHeader: styled.div`
    padding: 8px 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 20px;
    &:hover {
      cursor: pointer;
    }
    width: fit-content;
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
    top: 20px;
    left: 0;
    z-index: 999;
    background-color: white;
  `,
  DropDownValue: styled.span`
    color: grey;
    padding: 8px 12px;
    color: rgba(0, 0, 0, 0.46);
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
  Slots: styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top: 1.5rem;

    button {
      height: 4rem;
      width: 11rem;

      &:hover {
        transform: scale(1.01);
        opacity: 0.7;
        background: rgba(255, 32, 92, 0.8);
      }
    }

    & > * {
      box-sizing: border-box;
    }
  `,
  Time: styled.div`
    font-weight: 600;
    color: rgba(0, 0, 0, 0.46);
    font-size: 0.8em;
  `,
}

/*
<Button
          filled
          linkTo={
            !me
              ? phUrl
              : conId
              ? `/conversations/${conId}`
              : mentor.id !== me.id
              ? `/conversations/new?parts=${mentor.id}`
              : '/conversations'
          }
        >
          Message
        </Button>
*/
