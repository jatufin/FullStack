import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'


const Blog = ({ blog, update, remove, currentUser, showDetails }) => {
  const LIKE_BUTTON_TEXT = 'like'

  const hideWhenDetails = { display: showDetails ? 'none' : '' }
  const showWhenDetails = { display: showDetails ? '' : 'none' }

  const showIfOwner = {
    display: (currentUser.username === blog.user.username )
      ? ''
      : 'none'
  }

  const likeButton = () => (
    <button onClick={handleLike}>{LIKE_BUTTON_TEXT}</button>
  )

  const handleLike = () => {
    blog.likes = blog.likes ? blog.likes + 1 : 1
    update(blog)
  }

  const deleteButton = () => (
    <button
      onClick={handleDelete}
      style={showIfOwner}
    >
      remove
    </button>
  )

  const handleDelete = () => {
    remove(blog)
  }

  const Comments = () => {
    if(!blog.comments || blog.comments.length === 0) {
      return null
    }

    return (
      <div>
        <h2>comments</h2>
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    )
  }
  
  return(
    <div>
      <div style={hideWhenDetails} className='bloglist blogheader'>
        <p><Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link></p>
      </div>
      <div style={showWhenDetails} className='blog blogdetails'>
        <h2>{blog.title} {blog.author}</h2>
        <p>{blog.url}</p>
        <p>likes {blog.likes ? blog.likes : 0} {likeButton()}</p>
        <p>Added by {blog.user.name}</p>
        <p>{deleteButton()}</p>

        <Comments />
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired
}

export default Blog
