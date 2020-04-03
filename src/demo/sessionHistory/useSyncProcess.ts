import { delay, filter } from 'rxjs/operators'
import { useEmit, useSubscribe } from '../../events'
import { useRetry } from '../processManager'
import { Session, SessionHistory } from './sessionHistory'

const start = () => ({ type: 'process/sync/started' } as const)
const restart = () => ({ type: 'process/sync/restarted' } as const)
const complete = () => ({ type: 'process/sync/completed' } as const)
const fail = (e: any) => ({ type: 'process/sync/failed', error: e } as const)

// An example of some business logic that kicks off an async process
// This process "syncs" the app data with localStorage, simulating a network request
// It has a fake delay and will randomly fail to test the retry logic

export type SyncProcessActions = ReturnType<
  typeof start | typeof restart | typeof complete | typeof fail
>

export const commands = {
  start,
}

type SyncData = {
  sessions: Session[]
  sync_time: number
}

export const useSyncProcess = () => {
  const emit = useEmit()
  useRetry(start(), complete(), fail({}), restart(), 3)

  const sessionHistory = SessionHistory.useContainer()

  useSubscribe(
    s =>
      s
        .pipe(
          filter(x => x.type === 'process/sync/started' || x.type === 'process/sync/restarted'),
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

              console.log('local items', sessionHistory.state.sessions, newLocalItems)

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

            if (Math.random() < 0.3) {
              throw new Error('Random failure!')
            }

            emit(complete())
          } catch (e) {
            emit(fail(e))
          }
        }),
    [emit, sessionHistory]
  )
}
