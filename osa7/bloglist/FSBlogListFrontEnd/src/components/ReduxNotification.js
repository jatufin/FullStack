import React from 'react'
import { useSelector } from 'react-redux'

const ReduxNotification = () => {
  const message = useSelector(state => state.notification.message)
  const type = useSelector(state => state.notification.type)
  
  const style = {
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
    border: 'solid',
    color: (type === 'error') ? 'red' : 'green'
  }

  if(message.length === 0) {
    return null
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default ReduxNotification