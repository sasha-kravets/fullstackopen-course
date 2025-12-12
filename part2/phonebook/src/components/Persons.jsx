import Person from "./Person";

const Persons = ({ persons, query, handleDeletePerson }) => {
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      {filteredPersons.map(person =>
        <Person
          key={person.id}
          person={person}
          handleDeletePerson={() => handleDeletePerson(person.id)}
        />
      )}
    </div>
  )
}

export default Persons