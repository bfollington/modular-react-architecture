import * as React from 'react'
import { useSessionHistory } from './sessionHistory'
import { useSessionHistoryManager } from './useSessionHistoryManager'
import { useSyncProcess, commands as SyncProcess } from './useSyncProcess'
import { useEmit } from '../../events'

export const HistoryView = () => {
  useSessionHistoryManager()
  useSyncProcess()

  const sessionHistory = useSessionHistory()
  const emit = useEmit()
  const onSyncRequested = React.useCallback(() => emit(SyncProcess.start()), [emit])

  return (
    <div>
      <div>Sessions: {JSON.stringify(sessionHistory.state.sessions)}</div>
      <div>Total Duration {sessionHistory.totalDuration}</div>
      <button onClick={onSyncRequested}>Sync Sessions</button>
    </div>
  )
}
