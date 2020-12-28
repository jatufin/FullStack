import React from 'react'
import { connect } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const Filter = (props) => {
  const handleChange = (event) => {
    console.log('Filter: ', event.target.value)

    const filter = event.target.value
    props.setFilter(filter)
  }

  return(
    <div>
      filter
      <input
        type='text'
        name='filter'
        onChange={handleChange}
      ></input>
    </div>
  )
}

const mapStateToProps = null

const mapDispatchToProps = {
  setFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter)