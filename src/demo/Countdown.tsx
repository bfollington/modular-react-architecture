import {
  default as React,
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from 'react'
import { useEmit, useStreamCallback } from '@twopm/use-stream/lib'
import { EventStreamContext, Events } from '../events'
import { filter, tap } from 'rxjs/operators'

export type CountdownState = {
  duration: number
  timer: number
  ticking: boolean
  onComplete?: Events
}

export const initialState: CountdownState = {
  duration: 0,
  timer: 0,
  ticking: false,
  onComplete: undefined,
}

export type CountdownAction =
  | { type: 'countdown/started'; duration: number; onComplete: Events }
  | { type: 'countdown/cancelled' }
  | { type: 'countdown/complete' }
type InternalCountdownAction =
  | { type: 'start'; duration: number; onComplete: Events }
  | { type: 'cancel' }
  | { type: 'tick' }
  | { type: 'reset' }
  | { type: 'complete' }

export const reducer = (
  state: CountdownState,
  action: InternalCountdownAction
): CountdownState => {
  switch (action.type) {
    case 'start':
      return {
        ...state,
        timer: action.duration,
        duration: action.duration,
        ticking: true,
        onComplete: action.onComplete,
      }

    case 'tick':
      return {
        ...state,
        timer: state.timer - 1,
      }

    case 'cancel':
      return {
        ...state,
        ticking: false,
      }

    case 'complete':
      return {
        ...state,
        ticking: false,
      }

    case 'reset':
      return {
        ...state,
        timer: state.duration,
      }

    default:
      return state
  }
}

// Context, globally available

type CountdownContextValue = {
  state: CountdownState
}

const CountdownContext = createContext<CountdownContextValue>({
  state: initialState,
})

export const useCountdown = () => {
  const context = useContext(CountdownContext)

  if (!context) {
    throw new Error(`useCounter must be used within a CounterProvider`)
  }

  return context
}

export const CountdownManager = (props: any) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const emit = useEmit(EventStreamContext)

  useStreamCallback(
    EventStreamContext,
    s =>
      s
        .pipe(
          filter(x => x.type === 'countdown/started'),
          tap(console.log)
        )
        .subscribe(e => {
          dispatch({
            type: 'start',
            onComplete: e.onComplete,
            duration: e.duration,
          })
        }),
    [dispatch]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      if (state.ticking) {
        if (state.timer > 0) {
          dispatch({ type: 'tick' })
        } else {
          dispatch({ type: 'complete' })
          emit({ type: 'countdown/complete' })
          if (state.onComplete) {
            emit(state.onComplete)
          }
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [state, dispatch, emit])

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch]
  )

  return <CountdownContext.Provider value={value} {...props} />
}
