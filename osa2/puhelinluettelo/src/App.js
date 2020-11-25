import React, { useState } from 'react'

const App = () => {
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas', number: "040-123456" }
  ])

  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ nameFilter, setNameFilter] = useState('')

  const filteredPersons = persons.filter( person =>
        person.name.toUpperCase().includes(nameFilter.toUpperCase())
    )

  const addName = (event) => {
    event.preventDefault()

    if(persons.some(person => person.name === newName)) {
        alert(`${newName} is already added to phonebook`)
        return
    }

    setPersons(persons.concat({ name: newName, number: newNumber }))
  }

  const handleNameChange = (event) => {
      setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
      setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
      setNameFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
        <p>filter shown with: <input value={nameFilter} onChange={handleFilterChange} /></p>
      <form onSubmit={addName}>
        <div>
            <h3>add a new</h3>
            <p>name: <input value={newName} onChange={handleNameChange} /></p>
            <p>number: <input value={newNumber} onChange={handleNumberChange} /></p>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
          {filteredPersons.map(person =>
            <p key={person.name}>{person.name} {person.number}</p>
            )}
      </div>
    </div>
  )

}

export default App