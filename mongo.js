const mongoose = require('mongoose')

let url = "mongodb://MrNerd:1234@ds121088.mlab.com:21088/mrnerd-persons-db"

mongoose.connect(url)
mongoose.Promise = global.Promise


const Person = mongoose.model('Person', {
	name: String,
	number: String,
})

if (process.argv[2] && process.argv[3]) {
	let name = process.argv[2]
	let number = process.argv[3]

	let person = new Person({
		name, number
	})

	person.save().then((result) => {
		console.log("lisätään henkilö " + name + " numero " + number + " luetteloon")
		mongoose.connection.close();
	})
} else {
	Person.find().then((result) => {
		console.log("Puhelinluettelo: ")
		result.forEach((person) => {
			console.log(person.name + " " + person.number)
		})
		mongoose.connection.close();
	})
}