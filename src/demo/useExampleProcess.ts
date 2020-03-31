import { useEmit, useStreamCallback } from '@twopm/use-stream/lib'
import { filter } from 'rxjs/operators'
import { EventStreamContext } from '../events'
import { useRetry } from './processManager'

export type ProcessState = 'initial' | 'loading' | 'complete' | 'failed'
export const initialState: ProcessState = 'initial'

const start = () => ({ type: 'process/started' } as const)
const restart = () => ({ type: 'process/restarted' } as const)
const complete = () => ({ type: 'process/completed' } as const)
const fail = () => ({ type: 'process/failed' } as const)

export type ProcessAction = ReturnType<
  typeof start | typeof restart | typeof complete | typeof fail
>

export const useExampleProcess = (output: string) => {
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
}
