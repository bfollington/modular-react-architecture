import { useEmit, useStreamCallback } from '@twopm/use-stream/lib'
import { default as React } from 'react'
import { filter } from 'rxjs/operators'
import { EventStreamContext } from '../events'
import { useRetry } from './processManager'

export type ProcessState = 'initial' | 'loading' | 'complete' | 'failed'
export const initialState: ProcessState = 'initial'

const start = () => ({ type: 'process/started' })
const restart = () => ({ type: 'process/restarted' })
const complete = () => ({ type: 'process/completed' })
const fail = () => ({ type: 'process/failed' })

export type ProcessAction = ReturnType<
  typeof start | typeof restart | typeof complete | typeof fail
>

type Props = {
  output: string
}

export const ExampleProcess = ({ output }: Props) => {
  const emit = useEmit(EventStreamContext)

  useRetry(start(), complete(), fail(), restart(), 3)

  useStreamCallback(
    EventStreamContext,
    s =>
      s
        .pipe(
          filter(
            x => x.type === 'process/started' || x.type === 'process/restarted'
          )
        )
        .subscribe(_ => {
          setTimeout(() => {
            if (Math.random() < 0.2) {
              console.log('Process was asked to print:', output)
              emit({ type: 'process/completed' })
            } else {
              emit({ type: 'process/failed' })
            }
          }, 1000)
        }),
    [emit]
  )

  return <></>
}
