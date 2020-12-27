const notificationAtStart = ''

export const setNotification = (message) => {
  return {
    type: 'SET_NOTIFICATION',
    data: message
  }
}

export const clearNotification = () => {
  return {
    type: 'CLEAR_NOTIFICATION'
  }
}

const notificationReducer = (state = notificationAtStart, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data
    case 'CLEAR_NOTIFICATION':
      return ''
    default:
      return state
  }
}

export default notificationReducer