import { uport } from '../util/connectors.js'

const contract = require("truffle-contract");
const projectArtifacts = require("../../build/contracts/Portfolios.json");

class PortfoliosWrapper {

  Portfolios = contract(projectArtifacts);

  constructor() {
    this.Portfolios.setProvider(uport.getProvider());
  }

  votesLeft = () => {
    self.balance = this.Portfolios
      .at("0x4d602fd6be1131b8180858f6ee8b32f5d88fcba7")
      .then(instance => {
        return instance.votesLeft.call(this.account, {
          from: this.account
        });
      })
      .then(value => {
        return value;
      })
      .catch(e => {
        console.log(e);
      });
    console.log(self.balance);
    return self.balance;
  }
}

export default PortfoliosWrapper
