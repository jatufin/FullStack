import React, { useState, useEffect } from 'react'
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

const PersonList = ({ persons, deletePerson }) => {
    const deleteHandler = (person) => {
        return () => {
            deletePerson(person.id)
        }
    }

    return (
        <div>
            {persons.map(person =>
                <p key={person.id}>
                    {person.id} {person.name} {person.number}
                    <button onClick={deleteHandler(person)}>Delete</button>
                </p>
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
            const updatedPerson = persons.filter(person => person.name === newName)[0]
            
            if(updatedPerson.number === newNumber) {
                alert(`${newName} is already added to phonebook`)
                return
            }

            const c = window.confirm(
                `${newName} is already added to phonebook, replace the old number with a new one?`
            )

            if(c === false) {
                return
            }
            
            personsService
                .updateNumber(updatedPerson.id, newNumber)
                .then(returnedPerson => {
                    setPersons(
                        persons.map(person => person.id !== returnedPerson.id
                            ? person
                            : { ...person, number: returnedPerson.number }
                    ))
                })

            return
        }

        const newPerson = {
            name: newName,
            number: newNumber
        }

        personsService
            .createPerson(newPerson)
            .then(returnedPerson => {
                setPersons(persons.concat(returnedPerson))
            })
    }

    const deletePerson = (id) => {
        personsService
            .deletePerson(id)
            .then(resData =>
               setPersons(persons.filter(person => person.id !== id))
            )
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
            <PersonList deletePerson={deletePerson}
                persons={filteredPersons}
            />
        </div>
    )

}

export default App