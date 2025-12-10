import { useEffect, useState } from 'react'
import axios from 'axios'

const Filter = ({ query, handleSearch }) => {
  return (
    <div>filter shown with <input value={query} onChange={handleSearch} /></div>
  )
}

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>name: <input value={newName} onChange={handleNameChange} /></div>
      <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const Persons = ({ persons, query }) => {
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      {filteredPersons.map(person => <p key={person.name}>{person.name} {person.number}</p>)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
      .catch(error => console.error('Error fetching data:', error))
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleSearch = (event) => {
    setQuery(event.target.value);
  }

  const addPerson = (event) => {
    event.preventDefault()

    if (newName.trim() === '') {
      alert('Name cannot be empty');
      return;
    }

    if (!persons.find(person => person.name === newName)) {
      setPersons(persons.concat({ name: newName, number: newNumber, id: persons.length + 1 }));
      setNewName('');
      setNewNumber('');
    } else {
      alert(`${newName} is already added to phonebook`);
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
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
      <Persons persons={persons} query={query} />
    </div>
  )
}

export default App