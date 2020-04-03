import * as React from 'react'
import { Events, useEmit } from '../../events'
import { useTimer } from './timer'
import { useTimerManager, commands as Timer } from './useTimerManager'

export const TimerView = () => {
  useTimerManager()

  const emit = useEmit()
  const bindEmit = React.useCallback((e: Events) => () => emit(e), [emit])
  const onStartTimer = bindEmit(Timer.start(10))
  const onPauseTimer = bindEmit(Timer.pause())
  const onUnpauseTimer = bindEmit(Timer.unpause())
  const onCancelTimer = bindEmit(Timer.cancel())

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
