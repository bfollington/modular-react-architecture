import { useEmit, useStreamCallback } from '@twopm/use-stream/lib'
import { delay, filter } from 'rxjs/operators'
import { EventStreamContext } from '../../events'
import { useRetry } from '../processManager'
import { Session, SessionHistory } from './sessionHistory'

export const startSync = () => ({ type: 'process/sync/started' } as const)
const restart = () => ({ type: 'process/sync/restarted' } as const)
const complete = () => ({ type: 'process/sync/completed' } as const)
const fail = () => ({ type: 'process/sync/failed' } as const)

export type SyncProcessActions = ReturnType<
  typeof startSync | typeof restart | typeof complete | typeof fail
>

type SyncData = {
  sessions: Session[]
  sync_time: number
}

export const useSyncProcess = () => {
  const emit = useEmit(EventStreamContext)
  useRetry(startSync(), complete(), fail(), restart(), 3)

  const sessionHistory = SessionHistory.useContainer()

  useStreamCallback(
    EventStreamContext,
    s =>
      s
        .pipe(
          filter(
            x =>
              x.type === 'process/sync/started' ||
              x.type === 'process/sync/restarted'
          ),
          delay(1000)
        )
        .subscribe(_ => {
          // try to store sessions in localStorage
          try {
            const stored = localStorage.getItem('session_history')
            let loaded: Session[] = []
            if (stored !== null) {
              const syncData = JSON.parse(stored) as SyncData
              const newLocalItems = sessionHistory.state.sessions.filter(
                x => !syncData.sessions.some(y => x.id === y.id)
              )
              console.log(
                'local items',
                sessionHistory.state.sessions,
                newLocalItems
              )
              loaded = syncData.sessions
                .concat(newLocalItems)
                .sort((a, b) => a.timestamp - b.timestamp)
              sessionHistory.loadSessionHistory(loaded)
            }

            localStorage.setItem(
              'session_history',
              JSON.stringify({
                sessions: loaded,
                sync_time: new Date().getTime(),
              } as SyncData)
            )

            emit({ type: 'process/sync/completed' })
          } catch {
            emit({ type: 'process/sync/failed' })
          }
        }),
    [emit, sessionHistory]
  )
}
