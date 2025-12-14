import { useEffect, useState } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [query, setQuery] = useState('')
  const [notification, setNotification] = useState({ message: null, isError: false })

  const showNotification = (message, isError) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification({ message: null, isError: false })
    }, 5000)
  }

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch((error) => {
        console.error('Error:', error.message)
        showNotification(`Error: ${error.message}`, true)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setQuery(event.target.value)
  }

  const handleDeletePerson = (id) => {
    const person = persons.find(p => p.id === id)

    if (confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch((error) => {
          console.error('Error deleting person:', error)
          showNotification(`Information of ${person.name} has alreay been removed from server`, true)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const addPerson = (event) => {
    event.preventDefault()

    const name = newName.trim()
    const number = newNumber.trim()

    if (name === '') {
      alert('Name cannot be empty');
      return;
    }

    const person = persons.find(p => p.name.toLowerCase() === name.toLowerCase())

    const personObject = {
      name: name,
      number: number
    }

    if (!person) {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          showNotification(`Added ${name}`)
          setNewName('')
          setNewNumber('')
        })
        .catch((error) => {
          console.error('Error:', error.message)
          showNotification(`Error: ${error.message}`, true)
        })
    } else {
      if (confirm(`${name} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(person.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
            showNotification(`Updated ${name}`)
            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            showNotification(`Information of ${name} has alreay been removed from server`, true)
          })
      }
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />

      <Filter query={query} handleSearch={handleSearch} />

      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons
        persons={persons}
        query={query}
        handleDeletePerson={handleDeletePerson}
      />
    </div>
  )
}

export default App