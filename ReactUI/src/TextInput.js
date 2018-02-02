import React, {Component} from 'react'

export default class TextInput extends Component {

    render() {
        return(
            <div>
                {this.props.fieldName}: <input value={this.props.value} onChange={this.props.handleValueChange}/>
            </div>
        )
    }

}