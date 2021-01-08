import React, { useRef } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Blog from './Blog'
import Blogs from './Blogs'
import BlogForm from './BlogForm'
import Togglable from './Togglable'

import { createBlog, updateBlog, deleteBlog } from '../reducers/blogReducer'


const BlogsPage = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blog)
  const user = useSelector(state => state.user)

  const match = useRouteMatch('/blogs/:id')
  const blog = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  const blogFormRef = useRef()

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

export default BlogsPage
