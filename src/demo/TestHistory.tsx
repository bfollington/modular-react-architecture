import * as React from 'react'
import { useSessionHistory } from './SessionHistoryState'
import { useSessionHistoryManager } from './useSessionHistoryManager'
import { useSyncProcess } from './useSyncProcess'
import { useEventStream } from '../events'

export const TestHistory = () => {
  useSessionHistoryManager()
  useSyncProcess()

  const sessionHistory = useSessionHistory()
  const { emit } = useEventStream()
  const onSyncRequested = React.useCallback(
    () => emit({ type: 'process/sync/started' }),
    [emit]
  )

  return (
    <div>
      <div>Sessions: {JSON.stringify(sessionHistory.sessions)}</div>
      <button onClick={onSyncRequested}>Sync Sessions</button>
    </div>
  )
}
