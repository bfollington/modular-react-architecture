import React from 'react'
import './App.css'
import { EventLogger } from './demo/EventLogger'
import { Timer } from './demo/timer/TimerState'
import { EventStreamContext, stream } from './events'
import { TestApp } from './demo/timer/TestApp'
import { SessionHistory } from './demo/sessionHistory/SessionHistoryState'
import { TestHistory } from './demo/sessionHistory/TestHistory'

const App: React.FC = () => {
  return (
    <EventStreamContext.Provider value={stream}>
      <div className="App">
        <header className="App-header">
          <Timer.Provider>
            <TestApp />
          </Timer.Provider>
          <SessionHistory.Provider>
            <TestHistory />
          </SessionHistory.Provider>
          <EventLogger />
        </header>
      </div>
    </EventStreamContext.Provider>
  )
}

export default App
