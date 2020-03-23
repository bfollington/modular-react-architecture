import { Events } from '../events'
import { useReducer } from 'react'
import { createContainer } from 'unstated-next'

export type CountdownEvents =
  | { type: 'countdown/started'; duration: number; onComplete: Events }
  | { type: 'countdown/cancelled' }
  | { type: 'countdown/complete' }

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

const actions = {
  start: (duration: number, onComplete: Events) =>
    ({ type: 'start', duration, onComplete } as const),
  cancel: () => ({ type: 'cancel' } as const),
  tick: () => ({ type: 'tick' } as const),
  reset: () => ({ type: 'reset' } as const),
  complete: () => ({ type: 'complete' } as const),
}

type Actions = ReturnType<
  | typeof actions.start
  | typeof actions.cancel
  | typeof actions.tick
  | typeof actions.reset
  | typeof actions.complete
>

const useCountdown = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const start = (duration: number, onComplete: Events) =>
    dispatch(actions.start(duration, onComplete))
  const cancel = () => dispatch(actions.cancel())
  const tick = () => dispatch(actions.tick())
  const reset = () => dispatch(actions.reset())
  const complete = () => dispatch(actions.complete())

  return {
    state,
    start,
    cancel,
    tick,
    reset,
    complete,
  }
}

export const Countdown = createContainer(useCountdown)

const reducer = (state: CountdownState, action: Actions): CountdownState => {
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
