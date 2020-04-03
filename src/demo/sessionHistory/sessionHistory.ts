import { useReducer, useMemo } from 'react'
import { createContainer } from 'unstated-next'

export type Session = {
  id: string
  timestamp: number
  duration: number
}

export type SessionHistoryState = {
  sessions: Session[]
}

export const initialState: SessionHistoryState = {
  sessions: [],
}

const actions = {
  addSessionToHistory: (timestamp: number, duration: number) =>
    ({ type: 'sessionAddedToHistory', timestamp, duration } as const),
  loadSessionHistory: (sessions: Session[]) =>
    ({
      type: 'sessionHistoryLoaded',
      sessions,
    } as const),
}

type Actions =
  | ReturnType<typeof actions.addSessionToHistory>
  | ReturnType<typeof actions.loadSessionHistory>

const reducer = (state: SessionHistoryState, action: Actions): SessionHistoryState => {
  switch (action.type) {
    case 'sessionAddedToHistory':
      return {
        ...state,
        sessions: [
          ...state.sessions,
          {
            id: `session-${action.timestamp}`,
            timestamp: action.timestamp,
            duration: action.duration,
          },
        ],
      }

    case 'sessionHistoryLoaded':
      return {
        ...state,
        sessions: action.sessions,
      }

    default:
      return state
  }
}

export const SessionHistory = createContainer(() => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const addSessionToHistory = (timestamp: number, duration: number) =>
    dispatch(actions.addSessionToHistory(timestamp, duration))
  const loadSessionHistory = (sessions: Session[]) => dispatch(actions.loadSessionHistory(sessions))

  const totalDuration = useMemo(
    () => state.sessions.map(s => s.duration).reduce((acc, val) => acc + val, 0),
    [state]
  )

  return {
    state,
    totalDuration,
    addSessionToHistory,
    loadSessionHistory,
  }
})

export const useSessionHistory = () => {
  const s = SessionHistory.useContainer()
  return {
    state: s.state,
    totalDuration: s.totalDuration,
  }
}
