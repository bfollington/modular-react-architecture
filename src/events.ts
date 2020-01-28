import { makeEventStream, makeEventStreamContext } from '@twopm/use-stream'
import { CountdownAction } from './demo/Countdown'
import { ProcessAction } from './demo/ExampleProcess'

export type MouseClicked = { type: 'mouseClicked' }
export type MouseClicked10Times = { type: 'mouseClicked10Times' }

export type Events =
  | MouseClicked
  | MouseClicked10Times
  | CountdownAction
  | ProcessAction

export const stream = makeEventStream<Events>('main')
export const EventStreamContext = makeEventStreamContext<Events>()
