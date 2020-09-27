import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { TagInput } from '.'
import { useQuery, gql } from 'gql'
import type { Tag } from './TagInput'
import type { TagSearch, TagSearchVariables } from 'gql/types'

const TAG_SEARCH = gql`
  query TagSearch($input: String!) {
    search(term: $input, maxTags: 100) {
      tags {
        tag {
          id
          name
        }
        markup
      }
    }
  }
`

interface Props {
  selection: Tag[]
  onChange(tags: Tag[]): void
  placeholder?: string
  canAdd?: boolean
}

export default function TagSelect({
  selection,
  onChange,
  placeholder,
  canAdd = true,
}: Props) {
  const [input, setInput] = useState('')
  const [selected, setSelected] = useState<Tag['id']>()
  const [newSelected, setNewSelected] = useState(false)
  const listRef = useRef() as React.MutableRefObject<HTMLUListElement>
  const [lastScroll, setLastScroll] = useState(performance.now())
  const [toDelete, setToDelete] = useState<number>()

  const { data } = useQuery<TagSearch, TagSearchVariables>(TAG_SEARCH, {
    variables: { input },
  })
  const tags = data?.search?.tags ?? []

  useEffect(() => {
    if (!tags.length) {
      setSelected(undefined)
      setNewSelected(true)
    } else {
      setSelected(tags[0].tag.id)
      setNewSelected(false)
    }
  }, [input, tags])

  // keep selection in view
  useEffect(() => {
    if (!listRef || !listRef.current) return
    const index = tags.findIndex(({ tag }) => tag.id === selected)
    const node = listRef.current.children[index] as HTMLElement
    if (!node) return

    if (node.offsetTop < listRef.current.scrollTop) {
      listRef.current.scrollTop = node.offsetTop
      setLastScroll(performance.now())
    } else if (
      node.offsetTop + node.offsetHeight >
      listRef.current.scrollTop + listRef.current.offsetHeight
    ) {
      listRef.current.scrollTop =
        node.offsetTop + node.offsetHeight - listRef.current.offsetHeight
      setLastScroll(performance.now())
    }
  }, [selected, tags, listRef])

  function addTag(tag) {
    if (tag)
      onChange([
        ...selection,
        ...(!selection.find(
          ({ id, name }) =>
            id === tag.id || name.toLowerCase() === tag.name.toLowerCase()
        )
          ? [tag]
          : []),
      ])
    setInput('')
  }

  function handleKey(e) {
    if (e.key === 'Backspace') {
      if (input || !selection.length) return
      if (toDelete) {
        onChange(selection.slice(0, -1))
        setToDelete(undefined)
      } else setToDelete(selection.slice(-1)[0].id)
    } else setToDelete(undefined)
    if (['Enter', 'Tab', ','].includes(e.key)) {
      e.preventDefault()
      addTag(
        selected
          ? tags.find(({ tag }) => tag.id === selected)?.tag
          : { name: input, id: input }
      )
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (tags.length === 0) return
      e.preventDefault()
      const focusIndex = newSelected
        ? tags.length
        : tags.findIndex(({ tag }) => tag.id === selected)

      const nextSelected = Math.max(
        0,
        focusIndex + 1 * (e.key.endsWith('Down') ? 1 : -1)
      )
      if (nextSelected < tags.length) {
        setSelected(
          tags[
            Math.min(
              Math.max(0, focusIndex + 1 * (e.key.endsWith('Down') ? 1 : -1)),
              tags.length - 1
            )
          ].tag.id
        )
        setNewSelected(false)
      } else {
        setSelected(undefined)
        setNewSelected(true)
      }
    }
  }

  return (
    <S.Wrap>
      <TagInput
        value={input}
        onChange={setInput}
        tags={selection}
        highlight={toDelete}
        // @ts-ignore
        onKeyDown={handleKey}
        onTagClick={id => onChange(selection.filter(tag => tag.id !== id))}
        {...(selection.length === 0 && { placeholder })}
      />
      {input.length > 0 && (
        <S.List ref={listRef}>
          {tags.map(({ tag, markup }) => (
            <li
              key={tag.id}
              {...(tag.id === selected && { 'data-selected': true })}
              onMouseEnter={() => {
                if (performance.now() - lastScroll > 100) {
                  setSelected(tag.id)
                  setNewSelected(false)
                }
              }}
              onClick={() => addTag(tag)}
              dangerouslySetInnerHTML={{ __html: markup as string }}
            ></li>
          ))}
          {canAdd &&
            !tags
              .map(({ tag }) => tag.name.toLowerCase())
              .includes(input.toLowerCase()) && (
              <S.Add
                {...(newSelected && { 'data-selected': true })}
                onClick={() => addTag({ name: input, id: input })}
                onMouseEnter={() => {
                  if (performance.now() - lastScroll > 100) {
                    setNewSelected(true)
                    setSelected(undefined)
                  }
                }}
              >
                &lsquo;{input}&rsquo;
              </S.Add>
            )}
        </S.List>
      )}
    </S.Wrap>
  )
}

const S = {
  Wrap: styled.div`
    position: relative;
    z-index: 1000;
  `,

  List: styled.ul`
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    margin-top: 0.5rem;
    box-shadow: 0 1px 6px #0004;
    border-radius: var(--border-radius);
    list-style: none;
    padding: 0;
    background-color: #fff;

    --item-height: 2.8rem;

    max-height: calc(5 * var(--item-height));
    overflow-y: auto;

    li {
      padding: 0 1rem;
      font-size: 1rem;
      line-height: var(--item-height);
      cursor: pointer;

      &[data-selected] {
        background-color: #feeef2;
      }
    }
  `,

  Add: styled.li`
    font-weight: bold;

    &::before {
      content: 'ADD ';
      color: #ff205c;
    }
  `,
}
