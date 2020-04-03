import { Events } from '../../events'
import { useReducer } from 'react'
import { createContainer } from 'unstated-next'

// This is what I would refer to as a module of the application
// It contains a slice of state, a set of actions possible to update that state and a reducer to combine the two
// It is accessible using a hook for read-only (useTimer()) or read-write (Timer.useContainer())
// The internals of this module should, mostly, be ignored after being established

export type TimerState = {
  duration: number
  timer: number
  activeSession: boolean
  paused: boolean
  onComplete?: Events
}

export const initialState: TimerState = {
  duration: 0,
  timer: 0,
  activeSession: false,
  paused: false,
  onComplete: undefined,
}

const actions = {
  start: (duration: number, onComplete?: Events) =>
    ({ type: 'started', duration, onComplete } as const),
  cancel: () => ({ type: 'cancelled' } as const),
  tick: (deltaTime: number) => ({ type: 'ticked', deltaTime } as const),
  reset: () => ({ type: 'reset' } as const),
  pause: () => ({ type: 'paused' } as const),
  unpause: () => ({ type: 'unpaused' } as const),
  complete: () => ({ type: 'completed' } as const),
}

type ActionTypes = ReturnType<
  | typeof actions.start
  | typeof actions.cancel
  | typeof actions.tick
  | typeof actions.reset
  | typeof actions.pause
  | typeof actions.unpause
  | typeof actions.complete
>

const useTimerInner = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const start = (duration: number, onComplete?: Events) =>
    dispatch(actions.start(duration, onComplete))
  const cancel = () => dispatch(actions.cancel())
  const tick = (deltaTime: number) => dispatch(actions.tick(deltaTime))
  const reset = () => dispatch(actions.reset())
  const pause = () => dispatch(actions.pause())
  const unpause = () => dispatch(actions.unpause())
  const complete = () => dispatch(actions.complete())

  return {
    state,
    start,
    cancel,
    tick,
    reset,
    pause,
    unpause,
    complete,
  }
}

const reducer = (state: TimerState, action: ActionTypes): TimerState => {
  switch (action.type) {
    case 'started':
      return {
        ...state,
        timer: 0,
        duration: action.duration,
        activeSession: true,
        paused: false,
        onComplete: action.onComplete,
      }

    case 'ticked':
      return {
        ...state,
        timer: state.timer + action.deltaTime,
      }

    case 'cancelled':
      return {
        ...state,
        timer: 0,
        paused: false,
        activeSession: false,
      }

    case 'completed':
      return {
        ...state,
        activeSession: false,
      }

    case 'reset':
      return {
        ...state,
        timer: state.duration,
      }

    case 'paused':
      return {
        ...state,
        paused: true,
      }

    case 'unpaused':
      return {
        ...state,
        paused: false,
      }

    default:
      return state
  }
}

export const Timer = createContainer(useTimerInner)

export const useTimer = () => Timer.useContainer().state
