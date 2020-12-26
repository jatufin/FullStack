import React from 'react';
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const Statistics = ({ stats }) => {
  const all = stats.good + stats.ok + stats.bad

  if(all === 0) {
    return(
      <div>
        <p>No feedback given</p>
      </div>
    )
  }

  const average = (stats.good - stats.bad) / all
  const positive = stats.good / all

  return(
    <div>
      <div>good {stats.good}</div>
      <div>neutral {stats.ok}</div>
      <div>bad {stats.bad}</div>
      <div>all: {all}</div>
      <div>average: {average}</div>
      <div>positive: {positive} %</div>
    </div>
  )
}
const App = () => {
  const good = () => store.dispatch({ type: 'GOOD' })
  const ok = () => store.dispatch({ type: 'OK' })
  const bad = () => store.dispatch({ type: 'BAD' })
  const zero = () => store.dispatch({ type: 'ZERO' })

  return (
    <div>
      <button onClick={good}>good</button> 
      <button onClick={ok}>neutral</button> 
      <button onClick={bad}>bad</button>
      <button onClick={zero}>reset stats</button>
      <Statistics stats={store.getState()} />
    </div>
  )
}

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)
