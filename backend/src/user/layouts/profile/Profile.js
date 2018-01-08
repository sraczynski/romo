import React, { Component } from 'react'

var mnid = require('mnid')

class Profile extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Profile</h1>
            <p>
              <strong>Name</strong>: {this.props.authData.name}
            </p>
            <p>
              <strong>Your uPort MNID</strong>: {this.props.authData.address}
            </p>
            <p>
              <strong>Your Ethereum address</strong>: {mnid.decode(this.props.authData.address).address}
            </p>
          </div>
        </div>
      </main>
    )
  }
}

export default Profile
