import React, {Component} from 'react'
import TextInput from "./TextInput";

export default class AddingForm extends Component {

    handleSubmit = (event) => {
        event.preventDefault()
        this.props.handleSubmit()
    }



    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <TextInput
                    fieldName="Nimi"
                    value={this.props.name}
                    handleValueChange={this.props.handleNameChange}
                />

                <TextInput
                    fieldName="Numero"
                    value={this.props.number}
                    handleValueChange={this.props.handleNumberChange}
                />
                <div>
                    <button type="submit">lisää</button>
                </div>
            </form>
        )
    }

}