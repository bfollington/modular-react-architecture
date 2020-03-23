import { useEmit, useStreamCallback } from '@twopm/use-stream/lib'
import { default as React, useEffect, ReactNode } from 'react'
import { filter } from 'rxjs/operators'
import { EventStreamContext } from '../events'
import { Counter } from './CounterState'

type Props = {
  children: ReactNode
}

export const CounterManager = ({ children }: Props) => {
  const counter = Counter.useContainer()
  const emit = useEmit(EventStreamContext)

  useStreamCallback(
    EventStreamContext,
    s =>
      s.pipe(filter(x => x.type === 'mouseClicked')).subscribe(_ => {
        counter.increment()
      }),
    [counter]
  )

  useEffect(() => {
    if (counter.state.count === 5) {
      emit({
        type: 'countdown/started',
        duration: 3,
        onComplete: { type: 'process/started' },
      })
    }
  }, [counter, emit])

  return <>{children}</>
}
