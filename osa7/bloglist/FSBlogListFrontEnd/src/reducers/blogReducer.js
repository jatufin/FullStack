import blogService from '../services/blogs'
import { setReduxNotification } from './notificationReducer'

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

export const createBlog = (blogObject, user) => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(blogObject)

      newBlog.user = {
        username: user.username,
        name: user.name
      }

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

export const updateBlog = (blogObject) => {
  return async dispatch => {
    try {
      const updatedBlog = await blogService.update(blogObject)

      updatedBlog.user = {
        username: blogObject.user.username,
        name: blogObject.user.name
      }

      dispatch({
        type: 'UPDATE',
        data: updatedBlog
      })

    } catch(error) {
      dispatch(setReduxNotification(
        `Failed to update blog: ${error.message}`,
        5,
        'error'
      ))
    }
  }
}

export const deleteBlog = (blogObject) => {
  return async dispatch => {
    try {
      await blogService.remove(blogObject)

      dispatch({
        type: 'DELETE',
        data: { id: blogObject.id }
      })

      dispatch(setReduxNotification('blog removed', 5))

    } catch(error) {
      dispatch(setReduxNotification(
        `Failed to remove blog: ${error.message}`,
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
    case 'UPDATE':
      return state.map(blog => blog.id !== action.data.id
        ? blog
        : action.data
      )
    case 'DELETE':
      return state.filter(blog => blog.id !== action.data.id)
    default:
      return state
  }
}

export default blogReducer