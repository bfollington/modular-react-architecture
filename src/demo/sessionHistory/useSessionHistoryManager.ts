import { filter } from 'rxjs/operators'
import { useEmit, useSubscribe } from '../../events'
import { SessionHistory } from './sessionHistory'

export const useSessionHistoryManager = () => {
  const sessionHistory = SessionHistory.useContainer()
  const emit = useEmit()

  useSubscribe(
    s =>
      s.pipe(filter(x => x.type === 'timer/completed')).subscribe(e => {
        if (e.type === 'timer/completed') {
          sessionHistory.addSessionToHistory(new Date().getTime(), e.finalDuration)
          emit({ type: 'session/completed' })
        }
      }),
    [sessionHistory]
  )
}
