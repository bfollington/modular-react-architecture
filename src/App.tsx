import React from 'react'
import logo from './logo.svg'
import './App.css'
import { EventStreamContext, stream } from './events'
import { ClickSource } from './demo/ClickSource'
import { CounterProvider } from './demo/CounterState'
import CounterDisplay from './demo/CounterDisplay'
import { CountdownManager } from './demo/Countdown'
import { EventLogger } from './demo/EventLogger'
import { ExampleProcess } from './demo/ExampleProcess'

const App: React.FC = () => {
  return (
    <EventStreamContext.Provider value={stream}>
      <CountdownManager />
      <ClickSource />
      <ExampleProcess output="Example process!" />

      <div className="App">
        <header className="App-header">
          <CounterProvider>
            <CounterDisplay />
          </CounterProvider>
          <EventLogger />
        </header>
      </div>
    </EventStreamContext.Provider>
  )
}

export default App
