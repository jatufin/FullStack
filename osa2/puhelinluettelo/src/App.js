import React, { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons'

const Filter = (props) => {
    return (
        <div>
            <p>filter shown with: <input value={props.nameFilter} onChange={props.changeHandler} /></p>
        </div>
    )
}

const PersonForm = (props) => {
    return (
        <div>
            <form onSubmit={props.onSubmit}>
                <p>name: <input value={props.name} onChange={props.nameChangeHandler} /></p>
                <p>number: <input value={props.number} onChange={props.numberChangeHandler} /></p>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
        </div>
    )
}

const PersonList = ({ persons }) => {
    return (
        <div>
            {persons.map(person =>
                <p key={person.name}>{person.name} {person.number}</p>
            )}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [nameFilter, setNameFilter] = useState('')

    const filteredPersons = persons.filter(person =>
        person.name.toUpperCase().includes(nameFilter.toUpperCase())
    )

    useEffect(() => {
        personsService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
    }, [])
    
    const addName = (event) => {
        event.preventDefault()

        if (persons.some(person => person.name === newName)) {
            alert(`${newName} is already added to phonebook`)
            return
        }

        const newPerson = {
            name: newName,
            number: newNumber
        }

        personsService
            .create(newPerson)
            .then(returnedPerson => {
                setPersons(persons.concat(returnedPerson))
            })
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
            <h1>Phonebook</h1>
            <Filter
                nameFilter={nameFilter}
                changeHandler={handleFilterChange}
            />
            <h2>add a new</h2>
            <PersonForm
                onSubmit={addName}
                name={newName}
                nameChangeHandler={handleNameChange}
                number={newNumber}
                numberChangeHandler={handleNumberChange}
            />
            <h2>Numbers</h2>
            <PersonList
                persons={filteredPersons}
            />
        </div>
    )

}

export default App