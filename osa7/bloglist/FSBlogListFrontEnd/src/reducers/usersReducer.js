import usersService from '../services/users'
import { setReduxNotification } from './notificationReducer'

export const loadUsers = () => {
  return async dispatch => {
    try {
      const users = await usersService.getAll()

      dispatch({
        type: 'LOAD_USERS',
        data: users
      })
    } catch(error) {
      dispatch(setReduxNotification(
        `Error loading users: ${error.message}`,
        5,
        'error'
      ))
    }
  }

}

const usersReducer = (state = [], action) => {
  switch(action.type) {
    case 'LOAD_USERS':
      return action.data
    default:
      return state
  }
}

export default usersReducer