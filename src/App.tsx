import React from 'react'
import logo from './logo.svg'
import './App.css'
import { EventStreamContext, stream } from './events'
import { ClickSource } from './demo/ClickSource'
import { CounterManager } from './demo/CounterManager'
import CounterDisplay from './demo/CounterDisplay'
import { CountdownManager } from './demo/CountdownManager'
import { EventLogger } from './demo/EventLogger'
import { ExampleProcess } from './demo/ExampleProcess'
import { Counter } from './demo/CounterState'
import { Countdown } from './demo/CountdownState'

const App: React.FC = () => {
  return (
    <EventStreamContext.Provider value={stream}>
      <Countdown.Provider>
        <CountdownManager />
      </Countdown.Provider>
      <ClickSource />
      <ExampleProcess output="Example process!" />

      <div className="App">
        <header className="App-header">
          <Counter.Provider>
            <CounterManager>
              <CounterDisplay />
            </CounterManager>
          </Counter.Provider>
          <EventLogger />
        </header>
      </div>
    </EventStreamContext.Provider>
  )
}

export default App
