import defaultState from '../defaultState'

export default function(
  state = defaultState.conversations,
  action: any
): State['conversations'] {
  switch (action.type) {
    default:
      return state
  }
}
