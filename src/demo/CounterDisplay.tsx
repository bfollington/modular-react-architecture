import React from 'react'
import { Counter } from './CounterState'

const CounterDisplay = () => {
  const counter = Counter.useContainer()

  return (
    <>
      <label>Click count: {counter.state.count}</label>
    </>
  )
}

export default CounterDisplay
