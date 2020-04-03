import { makeEventStream, makeEventStreamContext, useStream } from '@twopm/use-stream'
import { SyncProcessActions } from './demo/sessionHistory/useSyncProcess'
import { TimerEvents } from './demo/timer/useTimerManager'
import { Observable } from 'rxjs'

export type Events = TimerEvents | { type: 'session/completed' } | SyncProcessActions

export const stream = makeEventStream<Events>('main')
export const EventStreamContext = makeEventStreamContext<Events>()
export const useEventStream = () => useStream(EventStreamContext)

export function useSubscribe(s$: (o: Observable<Events>) => void, deps?: ReadonlyArray<any>): void {
  return s$(useEventStream().stream)
}
