import * as React from 'react'
import { useSessionHistory } from './sessionHistory'
import { useSessionHistoryManager } from './useSessionHistoryManager'
import { useSyncProcess, startSync } from './useSyncProcess'
import { useEventStream } from '../../events'

export const HistoryView = () => {
  useSessionHistoryManager()
  useSyncProcess()

  const sessionHistory = useSessionHistory()
  const { emit } = useEventStream()
  const onSyncRequested = React.useCallback(() => emit(startSync()), [emit])

  return (
    <div>
      <div>Sessions: {JSON.stringify(sessionHistory.state.sessions)}</div>
      <div>Total Duration {sessionHistory.totalDuration}</div>
      <button onClick={onSyncRequested}>Sync Sessions</button>
    </div>
  )
}
