import React, { Component } from 'react'

class Home extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Welcome to RoMo!</h1>
            <p>This is the starting point for everything RoMo.</p>
            <h2>UPort Authentication</h2>
            <p>RoMo uses UPort for use authentication. You need to get a UPort
            app and profile <a href="https://www.uport.me/">here</a>. Please use
            a name that can be associated with your MojaPG entry.</p>
            <p>In the upper-right corner, you will see a login button. Click it
            to login with UPort.</p>
            <h2>IPFS</h2>
            <p>RoMo uses Inter-Planetary File System for storing whitepapers.</p>
          </div>
        </div>
      </main>
    )
  }
}

export default Home
