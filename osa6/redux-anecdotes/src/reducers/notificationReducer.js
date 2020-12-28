const notificationAtStart = { message: '', timeoutId: null }

export const clearNotification = () => {
  return async dispatch => {
    dispatch({
      type: 'CLEAR_NOTIFICATION'
    })
  }
}

export const setNotification = (message, seconds) => {
  return async dispatch => {

    const timeoutId = setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)

    dispatch({
      type: 'SET_NOTIFICATION',
      data: { message, timeoutId }
    })
  }
}

const notificationReducer = (state = notificationAtStart, action) => {
  switch (action.type) {

    case 'SET_NOTIFICATION':
      if(state.timeoutId) {
        clearTimeout(state.timeoutId)
      }
      return action.data

    case 'CLEAR_NOTIFICATION':
      return { message: '', timeoutId: null }

    default:
      return state
  }
}

export default notificationReducer