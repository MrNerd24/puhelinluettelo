const mongoose = require('mongoose')

let url = "mongodb://MrNerd:1234@ds121088.mlab.com:21088/mrnerd-persons-db"

mongoose.connect(url)
mongoose.Promise = global.Promise

let Schema = mongoose.Schema

let personSchema = new Schema({
    name: String,
    number: String,
})

personSchema.statics.format = (person) => {
    let formattedPerson = {...person._doc, id: person._id}
    delete formattedPerson._id
    delete formattedPerson.__v
    return formattedPerson
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person