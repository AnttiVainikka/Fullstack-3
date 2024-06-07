const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
]

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

app.get('/info', (request, response) => {
    response.send(`
    <div>
    Phonebook has info for ${persons.length} people
    <br></br>
    ${Date()}
    </div>`)
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  })


app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name and number required' 
        })
    }

    if (persons.map(person => person.name).includes(body.name)) {
        return response.status(400).json({
            error: 'name is already in phonebook'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000000)
    }

    persons = persons.concat(person)

    response.json(person)
    })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
