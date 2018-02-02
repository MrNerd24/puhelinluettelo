import React, {Component} from 'react'
import InformationRow from "./InformationRow";

export default class InformationTable extends Component {

    render() {
        return (
            <table>
                <tbody>
                {this.props.persons.map((person) => {
                    return (
                        <InformationRow handleDeleteClick={this.props.handleDeleteClick} key={person.name} person={person}/>
                    )
                })}
                </tbody>

            </table>
        )
    }

}