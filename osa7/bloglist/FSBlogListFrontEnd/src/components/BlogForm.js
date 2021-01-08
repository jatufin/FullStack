import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Button, Form } from 'react-bootstrap'

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleNewBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      title,
      author,
      url
    }

    addBlog(blogObject)

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Form onSubmit={handleNewBlog}>
      <Form.Group>
      <Form.Label>title:</Form.Label>
      <Form.Control
        id='title'
        type='text'
        onChange={({ target }) => setTitle(target.value)}
      />
      <Form.Label>author:</Form.Label>
      <Form.Control
        id='author'
        type='text'
        onChange={({ target }) => setAuthor(target.value)}
      />
      <Form.Label>url:</Form.Label>
      <Form.Control
        id='url'
        type='text'
        onChange={({ target }) => setUrl(target.value)}
      />
      <Button variant='primary' id='blog-submit' type='submit'>create</Button>
      </Form.Group>
    </Form>
  )
}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired
}

export default BlogForm