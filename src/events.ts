import {
  makeEventStream,
  makeEventStreamContext,
  useStream,
} from '@twopm/use-stream'
import { ProcessAction } from './demo/useExampleProcess'
import { TimerEvents } from './demo/TimerState'

export type Events = TimerEvents | ProcessAction | { type: 'session/completed' }

export const stream = makeEventStream<Events>('main')
export const EventStreamContext = makeEventStreamContext<Events>()
export const useEventStream = () => useStream(EventStreamContext)
