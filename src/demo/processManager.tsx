import { useState } from 'react'
import { filter } from 'rxjs/operators'
import { Events, useSubscribe, useEmit } from '../events'

export function useRetry(
  start: Events,
  complete: Events,
  failed: Events,
  retry: Events,
  retryLimit: number
) {
  const [retries, setRetries] = useState(0)
  const emit = useEmit()

  useSubscribe(
    s =>
      s.pipe(filter(x => x.type === start.type)).subscribe(_ => {
        console.log('process started')
      }),
    []
  )

  useSubscribe(
    s =>
      s.pipe(filter(x => x.type === complete.type)).subscribe(_ => {
        console.log('process complete')
      }),
    []
  )

  useSubscribe(
    s =>
      s.pipe(filter(x => x.type === failed.type)).subscribe(x => {
        if (x.type !== 'process/sync/failed') return

        console.log('process failed', x.error)

        if (retries < retryLimit) {
          console.log(`retrying (attempt ${retries + 1} of ${retryLimit})`)
          setRetries(retries + 1)
          emit(retry)
        } else {
          console.error('retry limit exceeded, process failed')
        }
      }),
    [retries, retryLimit, emit]
  )
}
