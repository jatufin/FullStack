import React from 'react'
import { useDispatch } from 'react-redux'

import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = (event) => {
    event.preventDefault()

    const content = event.target.anecdote.value
    anecdoteService.createNew(content)
    dispatch(createAnecdote(content))
    
    dispatch(setNotification(`You added anecdote '${content}'`))
    setTimeout(() => dispatch(clearNotification()), 5000) 
  }

  return(
    <form onSubmit={addAnecdote}>
      <input name='anecdote' />
      <button type='submit'>create</button>
    </form>
  )
}

export default AnecdoteForm