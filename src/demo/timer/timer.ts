import { Events } from '../../events'
import { useReducer } from 'react'
import { createContainer } from 'unstated-next'

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
    ({ type: 'start', duration, onComplete } as const),
  cancel: () => ({ type: 'cancel' } as const),
  tick: () => ({ type: 'tick' } as const),
  reset: () => ({ type: 'reset' } as const),
  pause: () => ({ type: 'pause' } as const),
  unpause: () => ({ type: 'unpause' } as const),
  complete: () => ({ type: 'complete' } as const),
}

type Actions = ReturnType<
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
  const tick = () => dispatch(actions.tick())
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

const reducer = (state: TimerState, action: Actions): TimerState => {
  switch (action.type) {
    case 'start':
      return {
        ...state,
        timer: 0,
        duration: action.duration,
        activeSession: true,
        paused: false,
        onComplete: action.onComplete,
      }

    case 'tick':
      return {
        ...state,
        timer: state.timer + 1,
      }

    case 'cancel':
      return {
        ...state,
        timer: 0,
        paused: false,
        activeSession: false,
      }

    case 'complete':
      return {
        ...state,
        activeSession: false,
      }

    case 'reset':
      return {
        ...state,
        timer: state.duration,
      }

    case 'pause':
      return {
        ...state,
        paused: true,
      }

    case 'unpause':
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
