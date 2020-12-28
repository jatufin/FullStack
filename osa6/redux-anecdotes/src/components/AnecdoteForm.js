import React from 'react'
import { connect } from 'react-redux'

import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
  const addAnecdote = (event) => {
    event.preventDefault()

    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    props.createAnecdote(content)
    props.setNotification(`You added anecdote '${content}'`, 5)
  }

  return(
    <form onSubmit={addAnecdote}>
      <input name='anecdote' />
      <button type='submit'>create</button>
    </form>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  createAnecdote,
  setNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(AnecdoteForm)