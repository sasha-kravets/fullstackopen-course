const express = require("express")
const morgan = require("morgan")
const app = express()

app.use(express.json())

morgan.token('person', (req) => {
  if (req.body !== undefined) {
    const person = {
      name: req.body.name,
      number: req.body.number,
    }

    return `${JSON.stringify(person)}`
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/info', (request, response) => {
  const message = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  response.send(message)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const newId = Math.floor(Math.random() * (1000000 - 1) + 1);
  return String(newId)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const duplicate = persons.find(person =>
    person.name.trim().toLowerCase() === body.name.trim().toLowerCase()
  )

  if (duplicate) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})