import { useReducer } from 'react'
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
    ({ type: 'addSession', timestamp, duration } as const),
}

type Actions = ReturnType<typeof actions.addSessionToHistory>

const useSessionHistoryInner = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const addSessionToHistory = (timestamp: number, duration: number) =>
    dispatch(actions.addSessionToHistory(timestamp, duration))

  return {
    state,
    addSessionToHistory,
  }
}

export const SessionHistory = createContainer(useSessionHistoryInner)

export const useSessionHistory = () => SessionHistory.useContainer().state

const reducer = (
  state: SessionHistoryState,
  action: Actions
): SessionHistoryState => {
  switch (action.type) {
    case 'addSession':
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

    default:
      return state
  }
}
