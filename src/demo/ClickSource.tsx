import { useEmit } from '@twopm/use-stream'
import React from 'react'
import { EventStreamContext } from '../events'

export const ClickSource = () => {
  const emit = useEmit(EventStreamContext)
  const onClick = () => emit({ type: 'mouseClicked' })

  return <div onClick={onClick}>Click me!</div>
}
