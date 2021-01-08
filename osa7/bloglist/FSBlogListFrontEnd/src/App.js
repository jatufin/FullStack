import React, { useState, useEffect, useRef } from 'react'
import {
  BrowserRouter as Router,
  Switch, Route, Link, useRouteMatch
} from 'react-router-dom'

import Blog from './components/Blog'
import Blogs from './components/Blogs'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Users from './components/Users'

import { useDispatch, useSelector } from 'react-redux'
import ReduxNotification from './components/ReduxNotification'
import { initBlogs, createBlog, updateBlog, deleteBlog } from './reducers/blogReducer'
import { returnSession, loginUser, logoutUser} from './reducers/userReducer'

import { Button, Form } from 'react-bootstrap'

const padding = {
  padding: 5
}

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
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control
            id='username'
            type='text'
            onChange={ ({ target }) => setUsername(target.value)}
          />
          <Form.Label>password:</Form.Label>
          <Form.Control
            id='password'
            type='password'
            onChange={ ({ target }) => setPassword(target.value)}
          />
          <Button variant='primary' id='login-button' type='submit'>login</Button>
        </Form.Group>
      </Form>
    </div>
  )
  
  const CurrentUser = () => (
      <span>
        {user.name} logged in&nbsp;
        <Button id='logout-button' onClick={() => {handleLogout()}}>logout</Button>  
      </span>
  )
  
  const BlogsPage = () => {
    const match = useRouteMatch('/blogs/:id')
    const blog = match
      ? blogs.find(b => b.id === match.params.id)
      : null
    
    if(!blog) {
      return(
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
    }

    return(
      <Blog
        showDetails={true}
        key={blog.id}
        blog={blog}
        update={renewBlog}
        remove={removeBlog}
        currentUser={user}        
      />
    )
  }

  const mainPage = () => (
    <div>
      <ReduxNotification />
      <Router>
        <div className='navigation'>
          <Link style={padding} to='/'>blogs</Link>
          <Link style={padding} to='/users'>users</Link>
          <CurrentUser />
        </div>
        <h2>blog app</h2>
        <Switch>
          <Route path ='/blogs/:id'>
            <BlogsPage />
          </Route>
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
    <div className='container'>
      { user === null
        ? loginPage()
        : mainPage()
      }
    </div>
  )
}

export default App