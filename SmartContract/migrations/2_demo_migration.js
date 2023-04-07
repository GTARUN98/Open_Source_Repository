const block = artifacts.require("Blockchain");

module.exports = function(deployer) {
  deployer.deploy(block);
};