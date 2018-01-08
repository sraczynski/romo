import React, { Component } from 'react'

class Home extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Welcome to RoMo!</h1>
            <p>This is the starting point for everything RoMo. You will need log
            in to start. If you like, you can read the source code of this dapp
            at <a href="https://github.com/sraczynski/romo">GitHub</a>.</p>
            <h2>UPort</h2>
            <p>RoMo uses UPort for user authentication. You need to get a UPort
            app and profile <a href="https://www.uport.me/">here</a>. Please use
            your full name.</p>
            <p>In the upper-right corner, you will see a login button. Click it
            to login with UPort. You will need to verify the login using UPort mobile app.
            Each Ethereum transaction (voting, joining a project, etc.) will
            require authorization with UPort.</p>
            <h2>IPFS</h2>
            <p>RoMo uses Inter-Planetary File System
            for storing whitepapers. Before registering your project in the system,
            please install an <a href="https://ipfs.io/docs/getting-started/">IPFS client</a>,
            upload your whitepaper (preferably in the PDF format) and keep it running before
            the file propagates in the network.</p>
            <h2>Rinkeby</h2>
            <p>The underlying smart contracts are stored on the Ethereum testnet
            called Rinkeby (network ID = 4), which uses clique consensus.</p>
            <h2>Other technologies used:</h2>
            <ul>
              <li>Node.js &ndash; asynchronous JavaScript web application framework,</li>
              <li>React.js &ndash; a UI library,</li>
              <li>Redux &ndash; state container for JS,</li>
              <li><a href="https://webpack.js.org/">Webpack</a> &ndash; JS application bundler,</li>
              <li>Solidity &ndash; Java-like smart contract language,</li>
              <li><a href="https://remix.ethereum.org/">Remix</a> &ndash; a Solidity IDE,</li>
              <li>Truffle &ndash; DApp development toolbox,</li>
              <li>Web3 &ndash; JavaScript library for accessing the Ethereum network,</li>
              <li>Google Cloud Platform &ndash; a System-as-a-Service cloud platform,</li>
            </ul>
          </div>
        </div>
      </main>
    )
  }
}

export default Home
