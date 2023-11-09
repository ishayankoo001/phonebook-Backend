require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 3001
const Person = require('./models/person')
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.listen(PORT)
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
morgan.token('type', function (req, res) { return JSON.stringify(req.body)})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :type"))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  app.get('/api/persons', (request, response)=>{
    Person.find({}).then(persons=>{
      response.json(persons)  
      console.log(JSON.stringify(persons))
    })
  })
  app.get('/api/persons/:id', (request, response)=>{
    Person.findById(request.params.id).then(person=>{
      response.json(person)
    }).catch(error=>{
      console.log(error)
      response.status(404).end()
    })
  })
  app.get('/info', (request, response)=>{
    response.send(`<h1>
    Phonebook has info for ${persons.length} people <br/>
    ${new Date()}
    </h1>
    `)
  })
  app.delete('/api/persons/:id', (request, response)=>{
    id = Number(request.params.id)
    persons = persons.filter(p=>p.id!==id)
    response.status(204).end()
  })
  generateId = ()=>{
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p=>p.id))
      : 0
    return maxId + 1
  }
  app.post('/api/persons', (request, response)=>{
    const body = request.body
    if(!body.name){
      return response.status(400).json({
        error: 'name missing'
      })
    }
    if(!body.number){
      return response.status(400).json({
        error: 'number missing'
      })
    }
    if(persons.find(p=>p.name===body.name)){
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
    const personToAdd = new Person({
      name: body.name,
      number: body.number,
    })
    personToAdd.save().then(savedPerson=>{
      response.json(savedPerson)
    })
  })
