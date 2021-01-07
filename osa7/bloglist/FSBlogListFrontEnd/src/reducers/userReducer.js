import Config from '../config'

import loginService from '../services/login'
import blogService from '../services/blogs'

import { setReduxNotification } from './notificationReducer'

export const returnSession = () => {
  return async dispatch => {
    const userJSON = window.localStorage.getItem(Config.STORAGE_KEY)

    if(userJSON) {
      const user = JSON.parse(userJSON)
      blogService.setToken(user.token)

      dispatch({
        type: 'LOGIN',
        data: user
      })

      dispatch(setReduxNotification(`Logged in as: ${user.name}`, 5))
    }
  }
}

export const loginUser = (username, password) => {
  return async dispatch => {
    try {
      const user = await loginService.login({ username, password })
    
      window.localStorage.setItem(
        Config.STORAGE_KEY,
        JSON.stringify(user)
      )

      blogService.setToken(user.token)

      dispatch({
        type: 'LOGIN',
        data: user
      })

      dispatch(setReduxNotification(`Login succesfull: ${user.name}`, 5))
    } catch(error) {
      dispatch(setReduxNotification(
        'wrong username or password',
        5,
        'error'
      ))
    }
  }
}

export const logoutUser = () => {
  return async dispatch => {
    window.localStorage.clear()
    blogService.setToken(null)

    dispatch({
      type: 'LOGOUT'
    })

    dispatch(setReduxNotification('Logged out', 5))
  }
}

const userReducer = (state = null, action) => {
  switch(action.type) {
    case 'LOGOUT':
      return null
    case 'LOGIN':
      return action.data
    default:
      return state
  }
}

export default userReducer
