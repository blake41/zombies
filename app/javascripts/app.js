// Import the page's CSS. Webpack will know what to do with it.
// import "../stylesheets/app.css";
//
import addresses from "../addresses.json";
const { zombieHelperAddress, zombieFactoryAddress } = addresses;
// // Import libraries we need.
// import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
//
// // Import our contract artifacts and turn them into usable abstractions.
import zombiefactory_artifacts from '../../build/contracts/ZombieFactory.json'
import zombiehelper_artifacts from '../../build/contracts/ZombieHelper.json'

// // MetaCoin is our usable abstraction, which we'll use through the code below.

// // The following code is simple to show off interacting with your contracts.
// // As your needs grow you will likely need to change its form and structure.
// // For application bootstrapping, check out window.addEventListener below.
// var accounts;
// var account;
//

//
window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }
  var zombiefactory = contract(zombiefactory_artifacts);
  zombiefactory.setProvider(web3.currentProvider);
  var zombieFactoryInstance = zombiefactory.at(zombieFactoryAddress);
  var zombiehelper = contract(zombiehelper_artifacts);
  zombiehelper.setProvider(web3.currentProvider);
  var zombieHelperInstance = zombiehelper.at(zombieHelperAddress);
  var contractInstances = {
    zombieHelper: zombieHelperInstance,
    zombieFactory: zombieFactoryInstance
  }
  window.App = {

    startApp: function() {
      var self = this;
      var userAccount = web3.eth.accounts[0];
      // var accountInterval = setInterval(function() {
      //
      // }, 1000);
      App.contractInstances.zombieHelper.NewZombie(function(err, event){
        self.getZombiesByOwner(userAccount)
        .then(function(data) {
            self.displayZombies(data.map(function(e) {return e.toNumber()}))
          }
        );
      })
      // this.createRandomZombie()
    },
    createRandomZombie: function() {
      this.contractInstances.zombieHelper.createRandomZombie('blake', {gas: 540000, from: web3.eth.accounts[0]})
    },
    getZombieDetails: function (id) {
      return this.contractInstances.zombieHelper.zombies(id);
    },
    getZombiesByOwner: function (address) {
      return this.contractInstances.zombieHelper.getZombiesByOwner.call(address);
    },
    contractInstances: contractInstances,
    displayZombies: function (ids) {
      $("#zombies").empty();
      for (var id of ids) {
        // Look up zombie details from our contract. Returns a `zombie` object
        this.getZombieDetails(id)
        .then(function(zombie) {
          // Using ES6's "template literals" to inject variables into the HTML.
          // Append each one to our #zombies div
          $("#zombies").append(`<div class="zombie">
            <ul>
              <li>Name: ${zombie[0]}</li>
              <li>DNA: ${zombie[1]}</li>
              <li>Level: ${zombie[2]}</li>
              <li>Wins: ${zombie[3]}</li>
              <li>Losses: ${zombie[4]}</li>
              <li>Ready Time: ${zombie[5]}</li>
            </ul>
          </div>`);
        });
      }
    }
  };
  App.startApp();

});
