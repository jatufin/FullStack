import React, { useState } from 'react'

import { useMutation } from '@apollo/client'

import { SET_BIRTHYEAR, ALL_AUTHORS } from './queries'

const Birthyear = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ setBirthyear] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [ { query: ALL_AUTHORS }]
  })

  if(!props.show) {
    return null
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
          born
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
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