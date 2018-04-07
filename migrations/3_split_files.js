var zombiehelper = artifacts.require("./zombiehelper.sol");
var zombieownership = artifacts.require("./zombieownership.sol");

module.exports = function(deployer) {
  // deployer.deploy(ownable);
  // deployer.deploy(safemath);
  // deployer.deploy(zombieattack);
  // deployer.deploy(zombiefactory);
  // deployer.deploy(zombiefeeding);
  deployer.deploy(zombiehelper);
  deployer.deploy(zombieownership);
};
