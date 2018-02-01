var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan')

var app = express();
app.use(bodyParser.json());
app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        JSON.stringify(req.body),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}))

var persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Martti Tienari",
        number: "040-123456",
        id: 2
    },
    {
        name: "Arto Järvinen",
        number: "040-123456",
        id: 3
    },
    {
        name: "Lea Kutvonen",
        number: "040-123456",
        id: 4
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req,res) => {
    res.send("<p>puhelinluettelossa " + persons.length + " henkilön tiedot</p><p>"+ new Date().toString() +"</p>")
})

app.get('/api/persons/:id', (req, res) => {
    let id = Number(req.params.id)
    let person = persons.find((personItem) => personItem.id === id)
    if(person) {
        res.json(person)
    } else {
        res.status(404).end()
    }

})

app.delete('/api/persons/:id', (req, res) => {
    let id = Number(req.params.id)
    persons = persons.filter(note => note.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    let body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({error: 'content missing'})
    }

    let person = {
        name: body.name,
        number: body.number,
        id: Math.round(Math.random()*10000)
    }

    let index = persons.findIndex((personsItem) => personsItem.name === person.name)
    if(index < 0) {
        persons.push(person)
    } else {
        return res.status(400).json({ error: 'name must be unique' })
    }

})

module.exports = app;
