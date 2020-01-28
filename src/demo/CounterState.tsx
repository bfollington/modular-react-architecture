import {
  default as React,
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from 'react'
import { useEmit, useStreamCallback } from '@twopm/use-stream/lib'
import { EventStreamContext } from '../events'
import { filter } from 'rxjs/operators'

export type CounterState = {
  count: number
}

export const initialState: CounterState = {
  count: 0,
}

export type CounterAction = 'increment' | 'decrement'

export const reducer = (
  state: CounterState,
  action: CounterAction
): CounterState => {
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

// Context, globally available

type CounterContextValue = {
  state: CounterState
  increment: () => void
  decrement: () => void
}

const CounterContext = createContext<CounterContextValue>({
  state: initialState,
  increment: () => {},
  decrement: () => {},
})

export const useCounter = () => {
  const context = useContext(CounterContext)

  if (!context) {
    throw new Error(`useCounter must be used within a CounterProvider`)
  }

  return context
}

export const CounterProvider = (props: any) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const emit = useEmit(EventStreamContext)

  useStreamCallback(
    EventStreamContext,
    s =>
      s.pipe(filter(x => x.type === 'mouseClicked')).subscribe(_ => {
        dispatch('increment')
      }),
    [dispatch]
  )

  useEffect(() => {
    if (state.count === 5) {
      emit({
        type: 'countdown/started',
        duration: 3,
        onComplete: { type: 'process/started' },
      })
    }
  }, [state, emit])

  const value = useMemo(
    () => ({
      state,
      increment: () => dispatch('increment'),
      decrement: () => dispatch('decrement'),
    }),
    [state, dispatch]
  )

  return <CounterContext.Provider value={value} {...props} />
}
