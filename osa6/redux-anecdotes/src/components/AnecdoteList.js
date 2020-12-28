import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { voteUpAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => { 
    const filteredAnecdotes =
      state.anecdotes.filter(a =>
        a.content.toUpperCase().includes(
          state.filter.toUpperCase()))

    const sortedAnecdotes =
      filteredAnecdotes.sort(
        (a, b) => b.votes - a.votes)

    return sortedAnecdotes
  })

  const dispatch = useDispatch()

  const vote = (anecdote) => {
    console.log('vote', anecdote.id)

    dispatch(voteUpAnecdote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }

  return(
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList