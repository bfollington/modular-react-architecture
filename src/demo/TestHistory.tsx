import * as React from 'react'
import { useSessionHistory } from './SessionHistoryState'
import { useSessionHistoryManager } from './useSessionHistoryManager'

export const TestHistory = () => {
  useSessionHistoryManager()

  const sessionHistory = useSessionHistory()

  return <div>Sessions: {JSON.stringify(sessionHistory.sessions)}</div>
}
