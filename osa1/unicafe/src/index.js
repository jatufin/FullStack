import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const FeedbackButton = ({onClick, text}) => {
  return(
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const StatisticLine = ({statFunction, text, suffix}) => {
  return(
    <p>
      {text} {statFunction()} {suffix}
    </p>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const statAll = () => {
    return good + neutral + bad
  }

  const statAverage = () => {
    return (good - bad) / statAll()
  }
  const statFunctionCreator = (statType) => () => {
    switch (statType) {
      case "goods":
        return good
      case "neutrals":
        return neutral
      case "bads":
        return bad
      case "all":
        return statAll()
      case "average":
        return isNaN(statAverage()) ? 0 : statAverage()
      case "positives":
        return good === 0 ? 0 : good / statAll()
      default:
        console.log("Invalid statistics type")
    }
  }
  if (statAll() === 0) {
    return(
      <div>
        <p>No feedback given</p>
      </div>
    )
  } else {
      return(
        <div>
          <StatisticLine text="good" statFunction={statFunctionCreator("goods")} />
          <StatisticLine text="neutral" statFunction={statFunctionCreator("neutrals")} />
          <StatisticLine text="bad" statFunction={statFunctionCreator("bads")} />
          <StatisticLine text="all" statFunction={statFunctionCreator("all")} />
          <StatisticLine text="average" statFunction={statFunctionCreator("average")} />
          <StatisticLine text="positive" statFunction={statFunctionCreator("positives")} suffix="%" />
        </div>
      )
  }
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const feedback = (feedbackType) => () => {
    switch (feedbackType) {
      case "good":
          setGood(good + 1)
          break
      case "neutral":
          setNeutral(neutral + 1)
          break
      case "bad":
          setBad(bad + 1)
          break
      default:
          console.log("Unknown feedback type")
    }
  }

  return (
    <div>
      <h1>give feedback</h1>

      <FeedbackButton onClick={feedback("good")} text="good" />
      <FeedbackButton onClick={feedback("neutral")} text="neutral" />
      <FeedbackButton onClick={feedback("bad")} text="bad" />

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)