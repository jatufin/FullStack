const notificationAtStart = ''

export const showNotification = (message) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: message
    })
  }
}

export const clearNotification = () => {
  return async dispatch => {
    dispatch({
      type: 'CLEAR_NOTIFICATION'
    })
  }
}

export const setNotification = (message, seconds) => {
  return async dispatch => {
    dispatch(showNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
    console.log('notification hidden')
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