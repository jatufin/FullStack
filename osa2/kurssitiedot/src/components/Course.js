import React from 'react'

const Course = ({course}) => {
    return(
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />  
        <Total parts={course.parts} />
      </div>
    )
  }
  const Header = (props) => {
    return (
      <div>
        <h2>{props.course}</h2>
      </div>
    )
  }
  
  const Content = ({parts}) => {
    return (
      <div>
        {parts.map(part =>
          <Part part={part.name} exercises={part.exercises} key={part.id} />  
        )}
      </div>
    )
  }
  
  const Part = (props) => {
    return (
      <>
        <p>{props.part} {props.exercises}</p>
      </>
    )
  }
  
  const Total = ({parts}) => {
    return (
      <h3>total of {parts.reduce((a, part) => a + part.exercises, 0)} exercises</h3>
    )
  }
  
  export default Course
  