var Portfolios = artifacts.require("./Portfolios.sol");

module.exports = function(deployer) {
  deployer.deploy(Portfolios);
};
