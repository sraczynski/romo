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
            <h1>Websam</h1>
            <p>You have ... left to give answers to the following questions.</p>
          </div>
        </div>
      </main>
    )
  }
}

export default Project
