import React from 'react'
import { connect } from 'react-redux'

import { voteUpAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const mapSTateToProps = (state) => {
  const filteredAnecdotes =
      state.anecdotes.filter(a =>
        a.content.toUpperCase().includes(
          state.filter.toUpperCase()))

  const sortedAnecdotes =
    filteredAnecdotes.sort(
      (a, b) => b.votes - a.votes)
  
  return { anecdotes: sortedAnecdotes }
}

const mapDispatchToProps = {
  voteUpAnecdote,
  setNotification
}
const AnecdoteList = (props) => {
  const vote = (anecdote) => {
    console.log('vote', anecdote.id)

    props.voteUpAnecdote(anecdote)
    props.setNotification(`you voted '${anecdote.content}'`, 5)
  }

  return(
    <div>
      {props.anecdotes.map(anecdote =>
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

export default connect(mapSTateToProps, mapDispatchToProps)(AnecdoteList)