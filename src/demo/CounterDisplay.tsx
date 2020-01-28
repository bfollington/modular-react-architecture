import React from 'react'
import { useCounter } from './CounterState'

const CounterDisplay = () => {
  const { state } = useCounter()

  return (
    <>
      <label>Click count: {state.count}</label>
    </>
  )
}

export default CounterDisplay
