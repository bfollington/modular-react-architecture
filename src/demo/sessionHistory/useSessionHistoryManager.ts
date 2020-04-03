import { filter, map } from 'rxjs/operators'
import { useEmit, useSubscribe } from '../../events'
import { SessionHistory } from './sessionHistory'
import { commands as Timer } from '../timer/useTimerManager'

export const useSessionHistoryManager = () => {
  const sessionHistory = SessionHistory.useContainer()
  const emit = useEmit()

  useSubscribe(
    s =>
      s
        .pipe(
          filter(x => x.type === 'timer/completed'),
          map(x => x as ReturnType<typeof Timer.complete>)
        )
        .subscribe(e => {
          sessionHistory.addSessionToHistory(new Date().getTime(), e.finalDuration)
          emit({ type: 'session/completed' })
        }),
    [sessionHistory]
  )
}
