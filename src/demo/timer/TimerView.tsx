import * as React from 'react'
import { useEventStream, Events } from '../../events'
import { useTimer } from './timer'
import { useTimerManager, commands as Timer } from './useTimerManager'

export const TimerView = () => {
  useTimerManager()

  const { emit } = useEventStream()
  const useEmit = React.useCallback((e: Events) => () => emit(e), [emit])
  const onStartTimer = useEmit(Timer.start(10))
  const onPauseTimer = useEmit(Timer.pause())
  const onUnpauseTimer = useEmit(Timer.unpause())
  const onCancelTimer = useEmit(Timer.cancel())

  const timer = useTimer()

  return (
    <div>
      <div>Timer is {timer.paused ? 'paused' : timer.activeSession ? 'ticking' : 'waiting'}</div>
      {timer.activeSession && <div>{timer.timer.toFixed(1)} seconds have passed.</div>}
      <button onClick={onStartTimer}>Start Timer</button>

      {timer.paused ? (
        <button onClick={onUnpauseTimer}>Unpause Timer</button>
      ) : (
        <button onClick={onPauseTimer}>Pause Timer</button>
      )}

      <button onClick={onCancelTimer}>Cancel Timer</button>
    </div>
  )
}
