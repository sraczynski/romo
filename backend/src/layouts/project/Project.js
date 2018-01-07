import React, { Component } from 'react'
import { uport } from '../../util/connectors.js'

const contract = require("truffle-contract");
const projectArtifacts = require("../../../build/contracts/Portfolios.json");
const bs58 = require('bs58')

import eq1 from '../../img/projects.gif'

class ProjectEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      i_project: props.i_project,
      title: props.title,
      investment: props.investment,
      whitepaper: props.whitepaper,
      myinvestment: "",
    };
  }
  render() {
    return(
      <div className="projectentry">
        <p><strong>{this.state.i_project}. {this.state.title}</strong></p>
        <p>
          Whitepaper link (via ipfs.jes.xxx): <a href={"https://ipfs.jes.xxx/ipfs/" + this.state.whitepaper}>ipfs/{this.state.whitepaper}</a>
        </p>
        <p>Investment so far: {this.state.investment}</p>
        <form data-n_project="{this.state.n_project}">
          <input type="text" value={this.state.myinvestment} placeholder="e.g., 100 benders" id="investment"/>
          <input type="submit" value="Invest" />
        </form>
      </div>
    )
  }
}

class Project extends Component {

  deployAddress = "0x4d602fd6be1131b8180858f6ee8b32f5d88fcba7";
  Portfolios = contract(projectArtifacts);

  homeProject = -1;

  constructor(props, { authData }) {
    super(props)
    authData = this.props

    this.Portfolios.setProvider(uport.getProvider());
    this.updateVotesLeft();
    this.updateHomeProject();
    this.updateCapital();
    this.updateProjects();

    this.state = {
      homeProject: -1,
      balance: null,
      grade: null,
      capital: null,
      projects: [],
      newtitle: '',
      newwhitepaper: ''
    };
  }

  // This is so WET....

  updateVotesLeft = () => {
    this.Portfolios.at(this.deployAddress).then(instance => {
        return instance.votesLeft.call(this.account, { from: this.account });
      }).then(value => {
        this.setState({ balance: (value / 1e15).valueOf() })
      }).catch(e => { console.log(e); });
  }

  updateHomeProject = () => {
    this.Portfolios.at(this.deployAddress).then(instance => {
        return instance.homeProject.call(this.account, { from: this.account });
      }).then(value => {
        this.setState({ homeProject: value.valueOf() });
      }).catch(e => { console.log(e); });
  }

  updateCapital = () => {
    this.Portfolios.at(this.deployAddress).then(instance => {
        return instance.capital.call(this.account, { from: this.account });
      }).then(value => {
        this.setState({ capital: (value / 1e15).valueOf() })
      }).catch(e => { console.log(e); });
  }

  updateGrade = () => {
    this.Portfolios.at(this.deployAddress).then(instance => {
        return instance.grade.call(this.account, { from: this.account });
      }).then(value => {
        this.setState({ grade: value.valueOf() })
      }).catch(e => { console.log(e); });
  }

  toIPFSHash = str => {
      // remove leading 0x
      const remove0x = str.slice(2, str.length);
      // add back the multihash id
      const bytes = Buffer.from(`1220${remove0x}`, "hex");
      const hash = bs58.encode(bytes);
      return hash;
  };

  updateProjects = () => {
    let n_projects;
    let portfolio;
    this.Portfolios.at(this.deployAddress).then(instance => {
        portfolio = instance;
        return portfolio.n_projects.call(this.account, { from: this.account });
      }).then(value => {
        n_projects = value.valueOf();
        let i_project;
        this.setState({ projects: [] })
        for (i_project = 0; i_project < n_projects; i_project++) {
          portfolio.projects.call(i_project).then(project => {
            let newproject = {
              'whitepaper': this.toIPFSHash(project[1]),
              'title': project[2],
              'votes': project[3].valueOf()
            };
            this.setState({ projects: [...this.state.projects, newproject] });
          })
        }
      })
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  newproject(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {

    var projectlist = [];
    for (var i_project = 0; i_project < this.state.projects.length; i_project++) {
      let project = this.state.projects[i_project];
      projectlist.push(<ProjectEntry i_project={i_project} title={project.title} investment={project.votes} whitepaper={project.whitepaper}/>);
    }

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Project</h1>
            <p>Allow this page few seconds to extract your info from the Ethereum network...</p>
            <h2>Instructions</h2>
            <p>Your project grade depends on
            your final capital, which is calculated as:</p>
            <img src={eq1} alt="Equation" />,
            <p>where V is the total investment for a project, I is the amount invested by you in a project,
            and N is the number of project members. i is your index, U the amount of uninvested benders and
            n index of your project.</p>
            <p>Every student has 1000 benders at the beginning and the teacher 35000 benders.
            If you do not invest at all,
            you will end up with a score of 500 benders, which converts 3.0. Anything between 500 and 1000
            benders results in 3.5. 4.0 is given below 1250, 4.5 below 1750 and everything above is awarded
            with 5.0.</p>
            <h2>Your portfolio</h2>
            <p>You have <span className="valuespan">{this.state.balance}</span> uninvested benders.</p>
            <p>Your total capital is <span className="valuespan">{this.state.capital}</span> benders.</p>
            <p>Your current grade is <span className="valuespan">{this.state.grade}</span>.</p>
            <h2>Your project</h2>
            {(this.state.homeProject != -1) ? (
              <p>Your project is {this.state.homeProject}.</p>
            ) : (
              <span id="noproject">
                <p>You are not part of a project. You need to create a new project or join an existing one.</p>
                <form onSubmit={this.newproject}>
                  <label>
                    Title:<br></br>
                    <input type="text" value={this.state.title} onChange={this.handleChange} />
                  </label><br></br>
                  <label>
                    IPFS hash of the whitepaper:<br></br>
                    <input type="text" value={this.state.whitepaper} onChange={this.handleChange} />
                  </label><br></br>
                  <input type="submit" value="Create" />
                </form>
              </span>
            )}
            <h2>Existing projects</h2>
            {projectlist}
          </div>
        </div>
      </main>
    )
  }
}

export default Project
