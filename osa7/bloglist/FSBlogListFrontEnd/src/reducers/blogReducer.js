import blogService from '../services/blogs'
import { setReduxNotification } from './notificationReducer'

export const createBlog = (blogObject) => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(blogObject)

      dispatch({
        type: 'ADD',
        data: newBlog
      })

      dispatch(setReduxNotification(
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
        5
      ))

    } catch(error) {
      dispatch(setReduxNotification(
        `Failed to add blog: ${error.message}`,
        5,
        'error'
      ))
    }
  }
}

export const initBlogs = () => {
  return async dispatch => {
    try {
      const blogs = await blogService.getAll()

      dispatch({
        type: 'INIT_BLOGS',
        data: blogs
      })
    } catch(error) {
      dispatch(setReduxNotification(
        `Error loading blogs: ${error.message}`,
        5,
        'error'
      ))
    }
  }
}

const blogReducer = (state = [], action) => {
  switch(action.type) {
    case 'ADD':
      return [...state, action.data]
    case 'INIT_BLOGS':
      return action.data
    default:
      return state
  }
}

export default blogReducer