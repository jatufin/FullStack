import React from 'react'
import { useDispatch } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    console.log('Filter: ', event.target.value)

    const filter = event.target.value
    dispatch(setFilter(filter))
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

export default Filter