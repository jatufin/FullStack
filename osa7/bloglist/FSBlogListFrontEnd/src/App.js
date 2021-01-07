import React, { useState, useEffect, useRef } from 'react'
import {
  BrowserRouter as Router,
  Switch, Route
} from 'react-router-dom'

import Blogs from './components/Blogs'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Users from './components/Users'

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
  
  const CurrentUser = () => (
    <div>
      <p>{user.name} logged in</p>
      <button id='logout-button' onClick={() => {handleLogout()}}>logout</button>  
    </div>
  )
  
  const BlogsPage = () => (
    <div>
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
        currentUser={user} />
    </div>
  )

  
  const mainPage = () => (
    <div>
      <h2>blogs</h2>
      <ReduxNotification />
      <CurrentUser />

      <Router>
        <Switch>
          <Route path ='/users'>
            <Users />
          </Route>
          <Route path='/'>
            <BlogsPage />
          </Route>
        </Switch>
      </Router>
    </div>
  )

  return (
    <div>
      { user === null
        ? loginPage()
        : mainPage()
      }
    </div>
  )
}

export default App