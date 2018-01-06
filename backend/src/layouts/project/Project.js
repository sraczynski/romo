import React, { Component } from 'react'

class Project extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Project</h1>
            <p><strong>Hello {this.props.authData.name}!</strong></p>
            <p>You have ... romos on your account.</p>
            <p>You are not part of a group. Click here to create one or here to
            join one</p>
          </div>
        </div>
      </main>
    )
  }
}

export default Project
