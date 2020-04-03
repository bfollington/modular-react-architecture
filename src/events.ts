import { makeEventStream, makeEventStreamContext, createHooks } from '@twopm/use-stream'
import { SyncProcessActions } from './demo/sessionHistory/useSyncProcess'
import { TimerEvents } from './demo/timer/useTimerManager'

export type Events = TimerEvents | { type: 'session/completed' } | SyncProcessActions

export const stream = makeEventStream<Events>('main')
export const EventStreamContext = makeEventStreamContext<Events>()

const hooks = createHooks(EventStreamContext)
export const useStream = hooks.useStream
export const useSubscribe = hooks.useSubscribe
export const useEmit = hooks.useEmit
