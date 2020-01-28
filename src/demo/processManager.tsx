import { useEmit, useStreamCallback } from '@twopm/use-stream/lib'
import { useState } from 'react'
import { filter } from 'rxjs/operators'
import { Events, EventStreamContext } from '../events'

export function useRetry(
  start: Events,
  complete: Events,
  failed: Events,
  retry: Events,
  retryLimit: number
) {
  const [retries, setRetries] = useState(0)
  const emit = useEmit(EventStreamContext)

  useStreamCallback(
    EventStreamContext,
    s =>
      s.pipe(filter(x => x.type === start.type)).subscribe(_ => {
        console.log('process started')
      }),
    []
  )

  useStreamCallback(
    EventStreamContext,
    s =>
      s.pipe(filter(x => x.type === complete.type)).subscribe(_ => {
        console.log('process complete')
      }),
    []
  )

  useStreamCallback(
    EventStreamContext,
    s =>
      s.pipe(filter(x => x.type === failed.type)).subscribe(_ => {
        console.log('process failed')

        if (retries < retryLimit) {
          console.log(`retrying (attempt ${retries + 1} of ${retryLimit})`)
          setRetries(retries + 1)
          emit(retry)
        }
      }),
    [retries, retryLimit, emit]
  )
}
