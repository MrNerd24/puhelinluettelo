
import Axios from 'axios'

let instance = null

export default class ServerDao {

    constructor() {
        if(instance === null) {
            this.baseURL = "/api/"
            instance = this
        }
        return instance
    }


    getPersons = async () => {
        let response = await Axios.get(this.baseURL + "persons")
        return response.data
    }

    postPerson = async (person) => {
        let response = await Axios.post(this.baseURL + "persons", person)
        return response.data
    }

    updatePerson = async (id,person) => {
        let response = await Axios.put(this.baseURL + "persons/" + id, person)
        return response.data
    }

    deletePerson = async (id) => {
        Axios.delete(this.baseURL + "persons/" + id)
    }

}