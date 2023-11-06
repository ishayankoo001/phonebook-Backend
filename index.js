const express = require('express')
const app = express()
app.use(express.json())
app.listen(3001)
const persons = [
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
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  app.get('/api/persons', (request, response)=>{
    response.json(persons)
  })
  app.get('/api/persons/:id', (request, response)=>{
    id = Number(request.params.id)
    console.log(id)
    const person = persons.find(p=>p.id===id)
    if(person){
      response.json(person)
    }
    else{
      response.status(404).end()
    }
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
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
  })
