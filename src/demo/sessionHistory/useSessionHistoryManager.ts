import { useEmit, useStreamCallback } from '@twopm/use-stream/lib'
import { filter } from 'rxjs/operators'
import { EventStreamContext } from '../../events'
import { SessionHistory } from './SessionHistoryState'

export const useSessionHistoryManager = () => {
  const sessionHistory = SessionHistory.useContainer()
  const emit = useEmit(EventStreamContext)

  useStreamCallback(
    EventStreamContext,
    s =>
      s.pipe(filter(x => x.type === 'timer/completed')).subscribe(e => {
        if (e.type === 'timer/completed') {
          sessionHistory.addSessionToHistory(
            new Date().getTime(),
            e.finalDuration
          )
          emit({ type: 'session/completed' })
        }
      }),
    [sessionHistory]
  )
}
