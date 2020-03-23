import { makeEventStream, makeEventStreamContext } from '@twopm/use-stream'
import { CountdownEvents } from './demo/CountdownState'
import { ProcessAction } from './demo/ExampleProcess'

export type MouseClicked = { type: 'mouseClicked' }
export type MouseClicked10Times = { type: 'mouseClicked10Times' }

export type Events =
  | MouseClicked
  | MouseClicked10Times
  | CountdownEvents
  | ProcessAction

export const stream = makeEventStream<Events>('main')
export const EventStreamContext = makeEventStreamContext<Events>()
