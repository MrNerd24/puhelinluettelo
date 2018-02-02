import React, {Component} from 'react'

export default class Notification extends Component {


    render() {
        let color = this.props.error ? "red" : "green"

        if(this.props.message) {
            return(
                <div style={{...Style.container, borderColor: color}}>
                    <p style={{...Style.p, color: color}}>{this.props.message}</p>
                </div>
            )
        } else {
            return null
        }

    }

}

const Style = {
    container: {
        border: "4px solid",
        backgroundColor: "lightGray",
        width: 500,
        margin: 10
    },

    p: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold"
    }
}