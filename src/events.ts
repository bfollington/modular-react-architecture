import {
  makeEventStream,
  makeEventStreamContext,
  useStream,
} from '@twopm/use-stream'
import { SyncProcessActions } from './demo/sessionHistory/useSyncProcess'
import { TimerEvents } from './demo/timer/useTimerManager'

export type Events =
  | TimerEvents
  | { type: 'session/completed' }
  | SyncProcessActions

export const stream = makeEventStream<Events>('main')
export const EventStreamContext = makeEventStreamContext<Events>()
export const useEventStream = () => useStream(EventStreamContext)
