const mongoose = require('mongoose')

let url = "mongodb://MrNerd:1234@ds121088.mlab.com:21088/mrnerd-persons-db"

mongoose.connect(url)
mongoose.Promise = global.Promise


const Person = mongoose.model('Person', {
    name: String,
    number: String,
})

module.exports = Person