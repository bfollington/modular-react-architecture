import * as React from 'react'
import { useEventStream } from '../../events'
import { useTimer } from './TimerState'
import {
  useTimerManager,
  startTimer,
  pauseTimer,
  unpauseTimer,
  cancelTimer,
} from './useTimerManager'

export const TimerView = () => {
  useTimerManager()

  const { emit } = useEventStream()
  const onStartTimer = React.useCallback(() => emit(startTimer(10)), [emit])
  const onPauseTimer = React.useCallback(() => emit(pauseTimer()), [emit])
  const onUnpauseTimer = React.useCallback(() => emit(unpauseTimer()), [emit])
  const onCancelTimer = React.useCallback(() => emit(cancelTimer()), [emit])

  const timer = useTimer()

  return (
    <div>
      <div>
        Timer is{' '}
        {timer.paused ? 'paused' : timer.activeSession ? 'ticking' : 'waiting'}
      </div>
      {timer.activeSession && <div>{timer.timer} seconds have passed.</div>}
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
