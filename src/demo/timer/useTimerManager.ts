import { useEmit, useStreamCallback } from '@twopm/use-stream/lib'
import { useEffect } from 'react'
import { filter } from 'rxjs/operators'
import { EventStreamContext, Events } from '../../events'
import { Timer } from './timer'

export type TimerEvents =
  | { type: 'timer/started'; duration: number; onComplete?: Events }
  | ReturnType<typeof pauseTimer>
  | ReturnType<typeof unpauseTimer>
  | ReturnType<typeof cancelTimer>
  | ReturnType<typeof completeTimer>

export const startTimer = (duration: number, onComplete?: Events) =>
  ({ type: 'timer/started', duration, onComplete } as const)
export const pauseTimer = () => ({ type: 'timer/paused' } as const)
export const unpauseTimer = () => ({ type: 'timer/unpaused' } as const)
export const cancelTimer = () => ({ type: 'timer/cancelled' } as const)
export const completeTimer = (finalDuration: number) =>
  ({ type: 'timer/completed', finalDuration } as const)

export const useTimerManager = () => {
  const timer = Timer.useContainer()
  const emit = useEmit(EventStreamContext)

  useStreamCallback(
    EventStreamContext,
    s =>
      s.pipe(filter(x => x.type === 'timer/started')).subscribe(e => {
        if (e.type === 'timer/started') {
          timer.start(e.duration, e.onComplete)
        }
      }),
    [timer]
  )

  useStreamCallback(
    EventStreamContext,
    s =>
      s.pipe(filter(x => x.type === 'timer/paused')).subscribe(e => {
        timer.pause()
      }),
    [timer]
  )

  useStreamCallback(
    EventStreamContext,
    s =>
      s.pipe(filter(x => x.type === 'timer/unpaused')).subscribe(e => {
        timer.unpause()
      }),
    [timer]
  )

  useStreamCallback(
    EventStreamContext,
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
        timer.tick()
      } else {
        timer.complete()
        emit({ type: 'timer/completed', finalDuration: timer.state.duration })
        if (timer.state.onComplete) {
          emit(timer.state.onComplete)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [timer, emit])
}
