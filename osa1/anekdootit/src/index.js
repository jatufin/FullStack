import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const MostVoted = ({votes, anecdotes}) => {
  let n=0

  for(let i=0 ; i < votes.length; i++) {
    if(votes[i] > votes[n]) {
      n=i
    }
  }

  // If no votes has been cast, show nothing
  if (votes[n] === 0) {
    return (<div></div>)
  }

  return(
    <div>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[n]}</p>
      <p>has {votes[n]} votes</p>
    </div>
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState([])

  const initVotes = () => {
    if(votes.length === anecdotes.length) {
      return
    }

    let a = new Array(anecdotes.length)

    for(let i=0;i<anecdotes.length;i++) {
      a[i] = 0
    }

    setVotes(a)
  }

  const randomAnecdote = () => {
    const n = Math.floor((Math.random() * anecdotes.length))
    setSelected(n)
  }

  const voteCurrent = () => {
    let v = [...votes]
    v[selected]++
    setVotes(v)

    console.log(v)
  }

  initVotes()
  
  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{props.anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={voteCurrent}>Vote</button>
      <button onClick={randomAnecdote}>Next anecdote</button>
      <MostVoted votes={votes} anecdotes={props.anecdotes} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)
