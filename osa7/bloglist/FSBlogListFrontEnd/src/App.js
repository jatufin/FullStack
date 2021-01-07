import Config from './config'

import React, { useState, useEffect, useRef } from 'react'

import Blogs from './components/Blogs'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

// import Notification from './components/Notification'

import { useDispatch, useSelector } from 'react-redux'
import ReduxNotification from './components/ReduxNotification'
import { setReduxNotification } from './reducers/notificationReducer'
import { initBlogs, createBlog } from './reducers/blogReducer'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  // const [blogs, setBlogs] = useState([])
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blog)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  

  useEffect(() => {
    dispatch(initBlogs())
  }, [dispatch])

  useEffect(() => {
    const userJSON = window.localStorage.getItem(Config.STORAGE_KEY)

    if(userJSON) {
      const user = JSON.parse(userJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      console.log('Talletaan avaimella', Config.STORAGE_KEY)

      window.localStorage.setItem(
        Config.STORAGE_KEY,
        JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(error) {
      dispatch(setReduxNotification(
        'wrong username or password',
        5,
        'error'
      ))
    }
  }

  const handleLogout = async () => {
    window.localStorage.clear()
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))
  }

  
  const updateBlog = async (blogObject) => { }
  /*  const updatedBlog = await blogService.update(blogObject)
    updatedBlog.user = {
      username: blogObject.user.username,
      name: blogObject.user.name
    }

    setBlogs(blogs.map(b =>
      b.id !== updatedBlog.id
        ? b
        : updatedBlog))
  }
  */

  const removeBlog = async (blogObject) => { }
  /*  if(!window.confirm(`remove ${blogObject.title} by ${blogObject.author}`)) {
      return
    }

    try {
      await blogService.remove(blogObject, user.token)

      setBlogs(blogs.filter(b => b.id !== blogObject.id))

      dispatch(setReduxNotification('blog removed', 5))
    } catch(error) {
      dispatch(setReduxNotification(
        `Failed to remove blog: ${error.message}`,
        5,
        'error'
      ))
    }
  }
  */

  const loginPage = () => (
    <div>
      <h2>log in to application</h2>
      <ReduxNotification />
      <form onSubmit={handleLogin}>
        <p><input
          id='username'
          type='text'
          onChange={ ({ target }) => setUsername(target.value)}
        /></p>
        <p><input
          id='password'
          type='password'
          onChange={ ({ target }) => setPassword(target.value)}
        /></p>
        <button id='login-button' type='submit'>login</button>
      </form>
    </div>
  )

  const blogsPage = () => (
    <div>
      <h2>blogs</h2>
      <ReduxNotification />
      <p>{user.name} logged in
        <button id='logout-button' onClick={() => {handleLogout()}}>logout</button>
      </p>

      <Togglable
        ref={blogFormRef}
        openButtonLabel='create new blog'
        closeButtonLabel='cancel'
      >
        <h2>create new</h2>
        <BlogForm addBlog={addBlog} />
      </Togglable>

      <Blogs
        blogs={blogs}
        updateBlog={updateBlog}
        removeBlog={removeBlog}
        currentUser={user}/>
    </div>
  )

  return (
    <div>
      { user === null
        ? loginPage()
        : blogsPage()
      }
    </div>
  )
}

export default App