import { uport } from '../util/connectors.js'

const contract = require("truffle-contract");
const projectArtifacts = require("../../build/contracts/Portfolios.json");

const bs58 = require('bs58')

class PortfoliosWrapper {

  deployAddress = "0x4d602fd6be1131b8180858f6ee8b32f5d88fcba7";
  Portfolios = contract(projectArtifacts);

  constructor() {
    this.Portfolios.setProvider(uport.getProvider());
    this.updateVotesLeft();
    this.updateHomeProject();
    this.updateProjects();
  }

  updateVotesLeft = () => {
    this.Portfolios
      .at(this.deployAddress)
      .then(instance => {
        return instance.votesLeft.call(this.account, {
          from: this.account
        });
      })
      .then(value => {
        self.balance = (value / 1e15).valueOf();
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateHomeProject = () => {
    this.Portfolios
      .at(this.deployAddress)
      .then(instance => {
        return instance.homeProject.call(this.account, {
          from: this.account
        });
      })
      .then(value => {
        self.balance = (value / 1e15).valueOf();
      })
      .catch(e => {
        console.log(e);
      });
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
    this.Portfolios
      .at(this.deployAddress)
      .then(instance => {
        portfolio = instance;
        return portfolio.n_projects.call(this.account, {
          from: this.account
        });
      })
      .then(value => {
        n_projects = value.valueOf();
        console.log(n_projects);
        let projects = [];
        let i_project;
        for (i_project = 0; i_project < n_projects; i_project++) {
          portfolio.projects.call(i_project).then(project => {
            projects[i_project] = {
              'whitepaper': this.toIPFSHash(project[1]),
              'title': project[2],
              'votes': project[3].valueOf()
            };
            console.log(projects[i_project]);
          })
        }
      })
  }

  get votesLeft() {
    this.updateVotesLeft();
    return self.balance;
  }
}

export default PortfoliosWrapper
