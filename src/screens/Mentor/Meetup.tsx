import React, { useState, useEffect, useRef } from 'react'
import styles from './profile.module.scss'
import { Card, Title } from '../../components'
import styled from 'styled-components'
import Icon from '../../components/Icon'
import Dropdown from '../../components/BookingDropdown'
import Request from './Request'
import Day from './Day'
import { ordNum, WEEK_DAYS, MONTHS } from '../../utils/date'
import Slots from './Slots'
import { useMe } from 'utils/hooks'

const Divider = () => (
  <Style.Divider>
    <Style.Line />
    <Style.Triangle />
    <Style.Line />
  </Style.Divider>
)

const getHighestMonth = (slotDays, firstIndex, maxItems) => {
  const monthCounter = (Object.entries(
    slotDays
      .filter(
        (_, index) => index >= firstIndex && index < firstIndex + maxItems
      )
      .reduce((acc, curVal): { [key: string]: number } => {
        const tempDate = new Date(curVal[0])
        const month = tempDate.getMonth()
        if (Object.prototype.hasOwnProperty.call(acc, month))
          acc[`${month}`] = acc[`${month}`] + 1
        else acc[`${month}`] = 1

        return acc
      }, {})
  ) as Array<[string, number]>).sort(
    (a: [string, number], b: [string, number]) => b[1] - a[1]
  )
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
    slotsByDates = [...Array(minDays).keys()].reduce((acc, _, curInd) => {
      curDate.setDate(curDate.getDate() + (curInd === 0 ? 0 : 1))
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
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
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
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  )
}

export default function Meetup({ mentor }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { me } = useMe()

  const [selectedSlot, setSelectedSlot] = useState<any | null>(null)
  const [selectedDay, setSelectedDay] = useState(-1)
  const [maxItems, setMaxItems] = useState(0)
  const [slotDays, setSlotDays] = useState(
    getDaysArray(mentor.slots || [], maxItems)
  )
  const [scrollMargin, setScrollMargin] = useState(0)
  const [months, setMonths] = useState([])
  const [curMonth, setCurMonth] = useState(undefined)

  const scrollToDay = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollOffset = scrollRef.current.scrollLeft
      let scrollTo = 0
      if (dir === 'right') scrollTo = maxItems * 87
      else scrollTo = -(maxItems * 87)
      scrollRef.current.scrollTo({
        left: scrollOffset + scrollTo,
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const firstIndex = scrollRef.current.scrollLeft / 87
        setCurMonth(getHighestMonth(slotDays, firstIndex, maxItems))
      }
    }
    if (scrollRef.current) {
      const node = scrollRef.current
      node.addEventListener('scroll', handleScroll)
      return () => node.removeEventListener('scroll', handleScroll)
    }
  }, [slotDays])

  const update = () => {
    if (scrollRef.current) {
      const numberOfEle = scrollRef.current.offsetWidth / 87
      const roundedNumberOfEle = Math.floor(numberOfEle)
      if (numberOfEle % 1 !== 0) {
        const missingMargin = ((numberOfEle % 1) * 87) / 2

        setScrollMargin(Math.round(missingMargin))
      }
      setMaxItems(roundedNumberOfEle)
      const sbd = getDaysArray(mentor.slots || [], roundedNumberOfEle)
      setSlotDays(sbd)
      const newAllMonths = sbd
        .reduce((acc, curVal) => {
          const tempDate = new Date(curVal)
          const month = tempDate.getMonth()
          if (month && acc.findIndex(el => el === month) === -1) acc.push(month)
          return acc
        }, [])
        .map(el => MONTHS[el])
      setMonths(newAllMonths)
      setCurMonth(
        getHighestMonth(
          sbd,
          scrollRef.current.scrollLeft / 87,
          roundedNumberOfEle
        ) || newAllMonths[0]
      )
    }
  }

  useEffect(() => {
    update()
  }, [mentor.slots, scrollRef.current])

  useEffect(() => {
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  })

  if (!me || me.id === mentor.id) return null

  return (
    //@ts-ignore
    <Card className={styles.meetup}>
      <Title size={3}>Send me a message or schedule a meetup</Title>
      <Dropdown
        values={months}
        selectedValue={curMonth}
        onSelect={newMonthIndex => {
          const newMonth = months[months.findIndex(m => m === newMonthIndex)]
          setCurMonth(newMonth)
          const indexOfFirstMonth = slotDays.findIndex(el => {
            const tempDate = new Date(el[0])
            return newMonth === MONTHS[tempDate.getMonth()]
          })
          if (scrollRef.current)
            scrollRef.current.scrollTo({
              left: indexOfFirstMonth * 87,
              top: 0,
              behavior: 'smooth',
            })
        }}
      />
      <Style.DayContainer>
        <Icon
          color="#8B8B8B"
          onClick={() => scrollToDay('left')}
          icon="angle_left"
        />
        <Style.ScrollView margin={scrollMargin} ref={scrollRef}>
          {slotDays.map((slotsByDay, index) => {
            return (
              <Day
                key={index}
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
            )
          })}
        </Style.ScrollView>
        <Icon
          color="#8B8B8B"
          onClick={() => scrollToDay('right')}
          icon="angle_right"
        />
      </Style.DayContainer>
      {selectedDay >= 0 && (
        <>
          <Divider />
          <Style.Time>{`${getSlotDayDate(
            slotDays[selectedDay][0]
          )}`}</Style.Time>
          <Slots
            slotDays={slotDays}
            selectedDay={selectedDay}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
          />
        </>
      )}
      {selectedSlot && (
        <>
          <Divider />
          <Request slot={selectedSlot} mentorName={mentor.name} />
        </>
      )}
    </Card>
  )
}

const Style = {
  ScrollView: styled.div<{ margin: number }>`
    scroll-snap-type: x mandatory;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    overflow: auto;
    width: 100%;
    padding-left: ${({ margin }) => `${margin}px`};
    padding-right: ${({ margin }) => `${margin}px`};

    & > div:not(:last-child) {
      margin-right: 13px;
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
  Time: styled.div`
    font-weight: 600;
    color: rgba(0, 0, 0, 0.46);
    font-size: 0.8em;
  `,
}
