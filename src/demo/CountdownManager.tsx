import { useEmit, useStreamCallback } from '@twopm/use-stream/lib'
import { default as React, useEffect, ReactNode } from 'react'
import { filter, tap } from 'rxjs/operators'
import { EventStreamContext } from '../events'
import { Countdown } from './CountdownState'

export const CountdownManager = ({ children }: { children?: ReactNode }) => {
  const countdown = Countdown.useContainer()
  const emit = useEmit(EventStreamContext)

  useStreamCallback(
    EventStreamContext,
    s =>
      s
        .pipe(
          filter(x => x.type === 'countdown/started'),
          tap(console.log)
        )
        .subscribe(e => {
          countdown.start(e.duration, e.onComplete)
        }),
    [countdown]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      if (!countdown.state.ticking) return

      if (countdown.state.timer > 0) {
        countdown.tick()
      } else {
        countdown.complete()
        emit({ type: 'countdown/complete' })
        if (countdown.state.onComplete) {
          emit(countdown.state.onComplete)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [countdown, emit])

  return <>{children}</>
}
