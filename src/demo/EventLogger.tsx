import React, { useState } from 'react'
import { Events, useSubscribe } from '../events'

export const EventLogger = () => {
  const [events, setEvents] = useState<Events[]>([])
  const [eventCount, setEventCount] = useState(0)

  useSubscribe(s => s.subscribe(ev => setEvents([...events, ev])), [events, setEvents])
  useSubscribe(s => s.subscribe(_ => setEventCount(eventCount + 1)), [eventCount, setEventCount])

  return (
    <div>
      <small>
        <label>{eventCount} events handled</label>
      </small>
      <ul>
        {events.map(ev => (
          <li>
            <small>{ev.type}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}
