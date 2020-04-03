import { useEmit } from '@twopm/use-stream/lib'
import { useEffect } from 'react'
import { filter } from 'rxjs/operators'
import { EventStreamContext, Events, useSubscribe } from '../../events'
import { Timer } from './timer'

// This is where business logic related to the timer lives
// This hook handles the ticking of the timer as well as external communication via the event stream
// Any behaviour changes would be done here and as such this code would see more frequent edits

const start = (duration: number, onComplete?: Events) =>
  ({ type: 'timer/started', duration, onComplete } as const)
const pause = () => ({ type: 'timer/paused' } as const)
const unpause = () => ({ type: 'timer/unpaused' } as const)
const cancel = () => ({ type: 'timer/cancelled' } as const)
const complete = (finalDuration: number) => ({ type: 'timer/completed', finalDuration } as const)

// The exported set of application-wide events
export type TimerEvents =
  | { type: 'timer/started'; duration: number; onComplete?: Events } // Prevent circular reference
  | ReturnType<typeof pause>
  | ReturnType<typeof unpause>
  | ReturnType<typeof cancel>
  | ReturnType<typeof complete>

// The exported set of application-wide commands
// These can be a subset of the above or change the interface as needed
export const commands = {
  start,
  pause,
  unpause,
  cancel,
  complete,
}

export const useTimerManager = () => {
  const timer = Timer.useContainer()
  const emit = useEmit(EventStreamContext)

  useSubscribe(
    s =>
      s.pipe(filter(x => x.type === 'timer/started')).subscribe(e => {
        if (e.type === 'timer/started') {
          timer.start(e.duration, e.onComplete)
        }
      }),
    [timer]
  )

  useSubscribe(
    s =>
      s.pipe(filter(x => x.type === 'timer/started')).subscribe(e => {
        if (e.type === 'timer/started') {
          timer.start(e.duration, e.onComplete)
        }
      }),
    [timer]
  )

  useSubscribe(
    s =>
      s.pipe(filter(x => x.type === 'timer/paused')).subscribe(e => {
        timer.pause()
      }),
    [timer]
  )

  useSubscribe(
    s =>
      s.pipe(filter(x => x.type === 'timer/unpaused')).subscribe(e => {
        timer.unpause()
      }),
    [timer]
  )

  useSubscribe(
    s =>
      s.pipe(filter(x => x.type === 'timer/cancelled')).subscribe(e => {
        timer.cancel()
      }),
    [timer]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      if (!timer.state.activeSession || timer.state.paused) return

      if (timer.state.timer < timer.state.duration) {
        timer.tick(0.01)
      } else {
        timer.complete()
        emit(complete(timer.state.duration))
        if (timer.state.onComplete) {
          emit(timer.state.onComplete)
        }
      }
    }, 10)

    return () => clearInterval(interval)
  }, [timer, emit])
}
