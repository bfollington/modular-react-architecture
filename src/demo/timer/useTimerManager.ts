import { useEffect } from 'react'
import { filter, map } from 'rxjs/operators'
import { Events, useEmit, useSubscribe } from '../../events'
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
  const emit = useEmit()

  useSubscribe(
    s =>
      s
        .pipe(
          filter(x => x.type === 'timer/started'),
          map(x => x as ReturnType<typeof start>)
        )
        .subscribe(e => {
          if (e.type === 'timer/started') {
            timer.start(e.duration, e.onComplete)
          }
        }),
    [timer]
  )

  useSubscribe(
    s =>
      s
        .pipe(
          filter(x => x.type === 'timer/paused'),
          map(x => x as ReturnType<typeof pause>)
        )
        .subscribe(e => {
          timer.pause()
        }),
    [timer]
  )

  useSubscribe(
    s =>
      s
        .pipe(
          filter(x => x.type === 'timer/unpaused'),
          map(x => x as ReturnType<typeof unpause>)
        )
        .subscribe(e => {
          timer.unpause()
        }),
    [timer]
  )

  useSubscribe(
    s =>
      s
        .pipe(
          filter(x => x.type === 'timer/cancelled'),
          map(x => x as ReturnType<typeof cancel>)
        )
        .subscribe(e => {
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
