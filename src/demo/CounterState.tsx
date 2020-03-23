import { createContainer } from 'unstated-next'
import { useReducer } from 'react'

type CounterState = {
  count: number
}
type CounterAction = 'increment' | 'decrement'

const reducer = (state: CounterState, action: CounterAction): CounterState => {
  switch (action) {
    case 'increment':
      return {
        ...state,
        count: state.count + 1,
      }

    case 'decrement':
      return {
        ...state,
        count: state.count - 1,
      }

    default:
      return state
  }
}

const useCounter = (initial = 0) => {
  const [state, dispatch] = useReducer(reducer, { count: initial })
  const increment = () => dispatch('increment')
  const decrement = () => dispatch('decrement')

  return { state, increment, decrement }
}

export const Counter = createContainer(useCounter)
