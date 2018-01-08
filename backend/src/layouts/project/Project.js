import React, { Component } from 'react'
import { uport } from '../../util/connectors.js'

const contract = require("truffle-contract");
const projectArtifacts = require("../../../build/contracts/Portfolios.json");
const bs58 = require('bs58')
var mnid = require('mnid')

import eq1 from '../../img/projects.gif'

class Project extends Component {

  deployAddress = "0x6784d69a4166d3852d40ca343e2c234f74cbcdef";
  Portfolios = contract(projectArtifacts);

  homeProject = -1;

  constructor(props, { authData }) {
    super(props)
    authData = this.props

    this.state = {
      homeProject: -1,
      balance: null,
      grade: null,
      capital: null,
      projects: [],
      newtitle: '',
      newwhitepaper: '',
      teacher: '',
      address: mnid.decode(this.props.authData.address).address
    };

    this.Portfolios.setProvider(uport.getProvider());

    let portfolios;

    this.Portfolios.at(this.deployAddress).then(instance => {
        portfolios = instance;
        return portfolios.teacher.call();
      }).then(value => {
        this.setState({ teacher: value })
        return portfolios.userActive.call(this.state.address);
      }).then(value => {
        if (!value) {
          return portfolios.claimBenders(this.state.address, { from: this.state.address });
        }
      }).then(result => {
        this.updateAll();
      }).catch(e => { console.log(e); });
  }

  updateAll = () => {
    this.updateVotesLeft();
    this.updateHomeProject();
    this.updateCapital();
    this.updateGrade();
    this.updateProjects();
  }

  // This is so WET....

  updateVotesLeft = () => {
    this.Portfolios.at(this.deployAddress).then(instance => {
        return instance.votesLeft(this.state.address, { from: this.state.teacher });
      }).then(value => {
        this.setState({ balance: (value / 1e15).valueOf() })
      }).catch(e => { console.log(e); });
  }

  updateHomeProject = () => {
    this.Portfolios.at(this.deployAddress).then(instance => {
        return instance.homeProject.call(this.state.address);
      }).then(value => {
        this.setState({ homeProject: parseInt(value.valueOf(), 10) });
      }).catch(e => { console.log(e); });
  }

  updateCapital = () => {
    this.Portfolios.at(this.deployAddress).then(instance => {
        return instance.capital.call(this.state.address,);
      }).then(value => {
        console.log(value);
        this.setState({ capital: (value / 1e15).valueOf() })
      }).catch(e => { console.log(e); });
  }

  updateGrade = () => {
    this.Portfolios.at(this.deployAddress).then(instance => {
        return instance.grade.call(this.state.address);
      }).then(value => {
        this.setState({ grade: (value / 2.0).valueOf() })
      }).catch(e => { console.log(e); });
  }

  // https://www.reddit.com/r/ethdev/comments/6lbmhy/a_practical_guide_to_cheap_ipfs_hash_storage_in/
  fromIPFSHash = hash => {
      const bytes = bs58.decode(hash);
      const multiHashId = 2;
      // remove the multihash hash id
      return bytes.slice(multiHashId, bytes.length);
  }

  decimalToHex = (d, padding) => {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
    while (hex.length < padding) {
        hex = "0" + hex;
    }
    return hex;
  }

  bin2hex = array => {
    var result = "0x";
    for (var i = 0; i < array.length; i++) {
      result += this.decimalToHex(array[i]);
    }
    return result;
  }

  bin2str = array => {
    var result = "";
    for (var i = 0; i < array.length; i++) {
      result += String.fromCharCode(array[i]);
    }
    return result;
  }

  // https://www.reddit.com/r/ethdev/comments/6lbmhy/a_practical_guide_to_cheap_ipfs_hash_storage_in/
  toIPFSHash = str => {
      // remove leading 0x
      const remove0x = str.slice(2, str.length);
      // add back the multihash id
      const bytes = Buffer.from(`1220${remove0x}`, "hex");
      const ipfs = bs58.encode(bytes);
      return ipfs;
  }

  updateProjects = () => {
    let n_projects;
    let portfolio;
    this.Portfolios.at(this.deployAddress).then(instance => {
        portfolio = instance;
        return portfolio.n_projects.call({ from: this.state.teacher });
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

  changeTitle(event) {
    this.setState({ newtitle: event.target.value });
  }

  changeWhitepaper(event) {
    this.setState({ newwhitepaper: event.target.value });
  }

  newproject(event) {
    event.preventDefault();
    let whitepaperdecoded = this.fromIPFSHash(this.state.newwhitepaper);
    this.Portfolios.at(this.deployAddress).then(instance => {
        return instance.newProject(this.state.address, this.bin2str(whitepaperdecoded), this.state.newtitle,
                                   { from: this.state.address });
      }).then(result => {
        this.updateAll();
      }).catch(e => { console.log(e); });
  }

  joinProject = (event) => {
    event.preventDefault();
    let i_project = event.target.i_project.value;
    this.Portfolios.at(this.deployAddress).then(instance => {
        return instance.joinProject(this.state.address, i_project,
                                   { from: this.state.address });
      }).then(result => {
        this.updateAll();
      }).catch(e => { console.log(e); });
  }

  invest = (event) => {
    event.preventDefault();
    let i_project = event.target.i_project.value;
    let amount = parseInt(event.target.amount.value, 10);
    this.Portfolios.at(this.deployAddress).then(instance => {
        return instance.vote(this.state.address, i_project, amount * 1e15,
                             { from: this.state.address });
      }).then(result => {
        this.updateAll();
      }).catch(e => { console.log(e); });
  }

  render() {

    var projectlist = [];
    for (var i_project = 0; i_project < this.state.projects.length; i_project++) {
      let project = this.state.projects[i_project];
      projectlist.push(<div className="projectentry" key={i_project}>
        <p><strong>{i_project + 1}. {project.title}</strong></p>
        <p>
          Whitepaper link (via ipfs.jes.xxx): <a href={"https://ipfs.jes.xxx/ipfs/" + project.whitepaper}>ipfs/{project.whitepaper}</a>
        </p>
        <p>Investment so far: {project.investment}</p>
        <form onSubmit={this.joinProject}>
          {(this.state.homeProject !== -1) ? (
            <span></span>
          ) : (
            <span>
              <input type="hidden" value={i_project} name="i_project"/>
              <input type="submit" value="Join this project" />
              <br />
            </span>
          )}
        </form>
        <form onSubmit={this.invest}>
          <input type="hidden" value={i_project} name="i_project"/>
          <input type="text" value={project.myinvestment} placeholder="e.g., 100 benders"
            name="amount" onChange={this.changeInvestment}/>
          <input type="submit" value="Invest" />
        </form>
      </div>)
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
            <p>Your final capital is <span className="valuespan">{this.state.capital}</span> benders.</p>
            <p>Your current grade is <span className="valuespan">{this.state.grade}</span>.</p>
            <h2>Your project</h2>
            {(this.state.homeProject !== -1) ? (
              <p>Your project is {this.state.homeProject + 1}.</p>
            ) : (
              <span id="noproject">
                <p>You are not part of a project. You need to create a new project or join an existing one.</p>
                <form onSubmit={this.newproject.bind(this)}>
                  <label>
                    Title:<br></br>
                    <input type="text" value={this.state.title} onChange={this.changeTitle.bind(this)} />
                  </label><br></br>
                  <label>
                    IPFS hash of the whitepaper:<br></br>
                    <input type="text" value={this.state.whitepaper} onChange={this.changeWhitepaper.bind(this)} />
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
