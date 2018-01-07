import React, { Component } from 'react'
import PortfoliosWrapper from './../../artifacts/portfolios.js'

import eq1 from '../../img/projects.gif'

var portfoliosWrapper = new PortfoliosWrapper();

class Project extends Component {

  constructor(props, { authData }) {
    super(props)
    authData = this.props
    this.state = {
      portfolios: portfoliosWrapper,
      title: '',
      whitepaper: ''
    };
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  newproject(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {

    const ifProjectSelected    = (this.state.portfolios.homeProject !== -1);

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Project</h1>
            <p>You have {this.state.portfolios.votesLeft} uninvested benders. Your project grade depends on
            your final capital, which is calculated as:</p>
            <img src={eq1} alt="Equation" />
            Every student has 1000 benders and the teacher 35000 benders. If you do not invest at all,
            you will end up with a score of 500 benders, which converts 3.0. Anything between 500 and 1000
            benders results in 3.5. 4.0 is given below 1250, 4.5 below 1750 and everything above is awarded
            with 5.0.
            {ifProjectSelected ? (
              <p>Your project is {this.state.portfolios.homeProject}.</p>
            ) : (
              <span id="noproject">
                <p>You are not part of a project. You need to create a new project or join an existing one.</p>
                <form onSubmit={this.newproject}>
                  <label>
                    Title:
                    <input type="text" value={this.state.title} onChange={this.handleChange} />
                  </label>
                  <label>
                    IPFS hash of the whitepaper:
                    <input type="text" value={this.state.whitepaper} onChange={this.handleChange} />
                  </label>
                  <input type="submit" value="Submit" />
                </form>
              </span>
            )}
          </div>
        </div>
      </main>
    )
  }
}

export default Project
