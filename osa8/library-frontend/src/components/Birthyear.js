import React, { useState } from 'react'
import Select from 'react-select'

import { useQuery, useMutation } from '@apollo/client'

import { SET_BIRTHYEAR, ALL_AUTHORS } from './queries'

const Birthyear = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const result = useQuery(ALL_AUTHORS)

  const [ setBirthyear] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [ { query: ALL_AUTHORS }]
  })

  if(!props.show) {
    return null
  }
  if(result.loading) {
    return <div>loading authors...</div>
  }

  const authors = result.data.allAuthors.map(a => {
    return { value: a.name, label: a.name }
  })
  
  const handleChange = (value) => {
    setName(value)
  }

  const submit = async (event) => {
    event.preventDefault()

    setBirthyear({ variables: { name, born: parseInt(born) } })

    setName('')
    setBorn('')
  }

  return(
    <div>
      <form onSubmit={submit}>
        <div>
          author
          <Select
            options={authors}
            onChange={v => handleChange(v.value)}
          />
        </div>
        <div>
          born
          <input
            type='number'
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>

        <button type='submit'>change birthdate</button>
      </form>
    </div>
  )
}

export default Birthyear