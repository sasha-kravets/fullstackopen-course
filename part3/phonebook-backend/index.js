require('dotenv').config()
const express = require("express")
const morgan = require("morgan")
const Person = require('./models/person')
const app = express()

app.use(express.static('dist'))
app.use(express.json())

morgan.token('person', (req) => {
  if (req.method === 'POST') {
    const person = {
      name: req.body.name,
      number: req.body.number,
    }

    return `${JSON.stringify(person)}`
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.get('/info', (request, response, next) => {
  Person
    .find({}).then(people => {
      const message = `<p>Phonebook has info for ${people.length} people</p><p>${new Date()}</p>`
      response.send(message)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(people => { response.json(people) })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => { response.status(204).end() })
    .catch(error => next(error))
})

// Saving person to DB
app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({ name, number })

  person.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})

// При завантаженні сторінки з БД підтягуються всі записи (разом з id)
// Тому коли ми робимо запит '/api/persons/:id', id дістається з потрібного запису з стану React (масив persons)
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save()
    })
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})