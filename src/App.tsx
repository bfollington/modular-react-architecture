import React from 'react'
import './App.css'
import { EventLogger } from './demo/EventLogger'
import { Timer } from './demo/TimerState'
import { EventStreamContext, stream } from './events'
import { TestApp } from './demo/TestApp'
import { SessionHistory } from './demo/SessionHistoryState'
import { TestHistory } from './demo/TestHistory'

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
