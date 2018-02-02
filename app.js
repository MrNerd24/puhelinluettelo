const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./Person')

const app = express()
app.use(bodyParser.json())

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

app.use(express.static('ReactUI/build'))


app.get('/api/persons', (req, res) => {
    Person.find({}).then((result) => {
        res.json(result.map(Person.format))
    })
})

app.get('/info', (req, res) => {
    Person.count().then((count) => {
        res.send('<p>puhelinluettelossa ' + count + ' henkilön tiedot</p><p>' + new Date().toString() + '</p>')
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then((result) => {
        if (result) {
            res.json(Person.format(result))
        } else {
            res.status(404).end()
        }
    }).catch(() => {
        res.status(400).json({error: 'malformatted id'})
    })
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).remove().then(() => {
        res.status(204).end()
    }).catch(() => {
        res.status(404).end()
    })
})

app.post('/api/persons', (req, res) => {
    let body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({error: 'content missing'})
    }

    Person.find({name: body.name}).then((result) => {
        if (result.length === 0) {
            let person = new Person({
                name: body.name,
                number: body.number,
            })

            person.save().then((result2) => {
                res.json(Person.format(result2))
            })
        } else {
            return res.status(400).json({error: 'name must be unique'})
        }
    })
})

app.put('/api/persons/:id', (req, res) => {
    let body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({error: 'content missing'})
    }

    let person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true}).then((person) => {
        res.json(Person.format(person))
    }).catch(() => {
        return res.status(400).json({error: 'malformatted id'})
    })
})

module.exports = app
