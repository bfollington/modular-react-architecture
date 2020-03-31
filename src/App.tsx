import React from 'react'
import './App.css'
import { EventLogger } from './demo/EventLogger'
import { HistoryView } from './demo/sessionHistory/HistoryView'
import { SessionHistory } from './demo/sessionHistory/SessionHistoryState'
import { Timer } from './demo/timer/TimerState'
import { TimerView } from './demo/timer/TimerView'
import { EventStreamContext, stream } from './events'

const App: React.FC = () => {
  return (
    <EventStreamContext.Provider value={stream}>
      <div className="App">
        <header className="App-header">
          <Timer.Provider>
            <TimerView />
          </Timer.Provider>
          <SessionHistory.Provider>
            <HistoryView />
          </SessionHistory.Provider>
          <EventLogger />
        </header>
      </div>
    </EventStreamContext.Provider>
  )
}

export default App
