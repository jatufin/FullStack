import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { Button, Form } from 'react-bootstrap'

const Blog = ({ blog, update, remove, currentUser, showDetails }) => {
  const hideWhenDetails = { display: showDetails ? 'none' : '' }
  const showWhenDetails = { display: showDetails ? '' : 'none' }

  const showIfOwner = {
    display: (currentUser.username === blog.user.username )
      ? ''
      : 'none'
  }

  const likeButton = () => (
    <Button onClick={handleLike}>like</Button>
  )

  const handleLike = () => {
    blog.likes = blog.likes ? blog.likes + 1 : 1
    update(blog)
  }

  const deleteButton = () => (
    <Button
      onClick={handleDelete}
      style={showIfOwner}
    >
      remove
    </Button>
  )

  const handleDelete = () => {
    remove(blog)
  }

  const Comments = () => {
    const [comment, setComment] = useState('')

    const sendComment = () => {
      const newComments = blog.comments.concat(comment)
      blog.comments = newComments

      update(blog)
    }

    const CommentList = () => {
      if(!blog.comments) {
        return (<h2>Ei kommentteja</h2>)
      }

      return (
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      )
    }

    return (
      <div>
        <h2>comments</h2>
        <Form onSubmit={sendComment}>
          <Form.Group>

            <Form.Control
              id='comment'
              type='text'
              onChange={({ target }) => setComment(target.value)}
            />
            <Button type='submit'>add comment</Button>
          </Form.Group>
        </Form>
        <CommentList />
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
