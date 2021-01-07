import React, { useState, useEffect, useRef } from 'react'

import Blogs from './components/Blogs'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

// import Notification from './components/Notification'

import { useDispatch, useSelector } from 'react-redux'
import ReduxNotification from './components/ReduxNotification'
import { initBlogs, createBlog, updateBlog, deleteBlog } from './reducers/blogReducer'
import { returnSession, loginUser, logoutUser} from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blog)
  const user = useSelector(state => state.user)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initBlogs())
    dispatch(returnSession())
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()

    dispatch(loginUser(username, password))
    setUsername('')
    setPassword('')
  }

  const handleLogout = async () => {

    dispatch(logoutUser())

  }

  const addBlog = async (blogObject) => {

    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject, user))

  }

  
  const renewBlog = async (blogObject) => {

    dispatch(updateBlog(blogObject))

  }

  const removeBlog = async (blogObject) => {
    if(!window.confirm(`remove ${blogObject.title} by ${blogObject.author}`)) {
      return
    }

    dispatch(deleteBlog(blogObject))
  }

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
        updateBlog={renewBlog}
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