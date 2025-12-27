const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
}

const password = process.argv[2]

const url = `mongodb+srv://skravets:${password}@cluster0.gbdhaqx.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personScheme = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personScheme)

if (process.argv.length === 3) {
  try {
    Person
      .find({})
      .then(result => {
        console.log('phonebook:')
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })

        mongoose.connection.close()
      })
  } catch (error) {
    console.log(error.message)
    mongoose.connection.close()
  }
} else if (process.argv.length === 5) {
  try {
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4]
    })

    person.save().then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      mongoose.connection.close()
    })
  } catch (error) {
    console.log(error.message)
    mongoose.connection.close()
  }
} else {
  console.log('name or number missing')
  mongoose.connection.close()
}