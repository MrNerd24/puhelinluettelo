const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
}

url = process.env.MONGODB_URI

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