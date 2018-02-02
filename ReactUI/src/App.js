import React from 'react';
import AddingForm from "./AddingForm";
import TextInput from "./TextInput";
import InformationTable from "./InformationTable";
import ServerDao from "./ServerDao";
import Notification from "./Notification";

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            persons: [
                {name: 'Arto Hellas', number: '040-123456'},
                {name: 'Martti Tienari', number: '040-123456'},
                {name: 'Arto Järvinen', number: '040-123456'},
                {name: 'Lea Kutvonen', number: '040-123456'}
            ],
            newName: '',
            newNumber: '',
            filter: '',
            notificationMessage: "",
            notificationIsError: false
        }
        this.timer = null
        this.serverDao = new ServerDao()
    }

    async componentWillMount() {
        try {
            let data = await this.serverDao.getPersons()
            this.setState({persons: data})
        } catch(error) {
            this.setMessage("Yhteustietojen haku palvelimelta epäonnistui.", true)
        }

    }

    setMessage = (message, error) => {
        if(!error) {
            error=false
        }
        if(this.timer) {
            clearTimeout(this.timer)
        }
        this.setState({notificationMessage: message, notificationIsError: error})
        this.timer = setTimeout(() => {
            this.setState({notificationMessage: "", notificationIsError: false})
        }, 5000)
    }

    handleNameChange = (event) => {
        let value = event.target.value
        this.setState({
            newName: value
        })
    }

    handleNumberChange = (event) => {
        let value = event.target.value
        this.setState({
            newNumber: value
        })
    }

    handleSubmit = async () => {
        try {
            let newPerson = {name: this.state.newName, number: this.state.newNumber}
            let persons = this.state.persons
            if (!persons.some((person) => person.name === this.state.newName)) {
                let newPersonWithId = await this.serverDao.postPerson(newPerson)
                persons = [...persons, newPersonWithId]
            } else {
                if(window.confirm(newPerson.name + " on jo luettelossa, korvataanko vanha numero uudella?")) {
                    let existingPerson = this.state.persons.find((person) => person.name === newPerson.name)
                    let existingPersonWithNewNumber = {...existingPerson, number: newPerson.number}
                    try{
                        let existingPersonFromServer = await this.serverDao.updatePerson(existingPersonWithNewNumber.id, existingPersonWithNewNumber)
                        persons = persons.map((person) => person.id === existingPersonFromServer.id ? existingPersonFromServer : person)
                    } catch(e) {
                        let newPersonWithId = await this.serverDao.postPerson(existingPersonWithNewNumber)
                        persons = persons.map((person) => person.name === newPersonWithId.name ? newPersonWithId : person)
                    }

                }
            }

            this.setState({
                persons,
                newName: "",
                newNumber: ""
            })
            this.setMessage("Lisättiin " + newPerson.name)
        } catch (error) {
            this.setMessage("Yhteystiedon lisäys epäonnistui.", true)
        }

    }


    handleFilterChange = (event) => {
        let value = event.target.value
        this.setState({
            filter: value
        })
    }

    handleDeleteClick = async (person) => {
        if(window.confirm("Poistetaanko " + person.name + "?")) {
            try {
                await this.serverDao.deletePerson(person.id)
                let index = this.state.persons.findIndex((personsItem) => personsItem.id === person.id)
                this.setState({
                    persons: [...this.state.persons.slice(0,index), ...this.state.persons.slice(index+1, this.state.persons.length)]
                })
                this.setMessage("Poistettiin " + person.name)
            } catch(error) {
                this.setMessage("Yhteystiedon poistaminen epäonnistui.", true)
            }

        }

    }

    render() {

        let persons = this.state.filter ? this.state.persons.filter((person) => person.name.toLowerCase().search(this.state.filter.toLowerCase()) >= 0) : this.state.persons

        return (
            <div>
                <h2>Puhelinluettelo</h2>
                <Notification message={this.state.notificationMessage} error={this.state.notificationIsError}/>
                <TextInput
                    fieldName="Rajaa sisältöä"
                    value={this.state.filter}
                    handleValueChange={this.handleFilterChange}
                />
                <h2>Lisää uusi</h2>
                <AddingForm
                    name={this.state.newName}
                    number={this.state.newNumber}
                    handleNameChange={this.handleNameChange}
                    handleNumberChange={this.handleNumberChange}
                    handleSubmit={this.handleSubmit}
                />
                <h2>Numerot</h2>
                <InformationTable
                    handleDeleteClick = {this.handleDeleteClick}
                    persons={persons}
                />
            </div>
        )
    }
}

export default App