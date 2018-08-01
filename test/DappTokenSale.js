  var DappToken = artifacts.require('./DappToken.sol');
  var DappTokenSale = artifacts.require('./DappTokenSale.sol');

  contract('DappTokenSale', function(accounts) {
    var tokenInstance; // keep track of 
    var tokenSaleInstance;
    var admin = accounts[0];
    var buyer = accounts[1]; 
    var tokenPrice = 1000000000000000; // in wei keep track of ether 
    var tokensAvailable = 750000;
    var numberOfTokens;
    // 
    it('initializes the contract with the correct values', function() {
      //return an instance of the deployed contract 
      return DappTokenSale.deployed().then(function(instance) {
        tokenSaleInstance = instance;
        return tokenSaleInstance.address
      }).then(function(address) { //dynamic 
        assert.notEqual(address, 0x0, 'has contract address');
        return tokenSaleInstance.tokenContract();
      }).then(function(address) { // the address of the token contract 
        assert.notEqual(address, 0x0, 'has token contract address');
        return tokenSaleInstance.tokenPrice();
      }).then(function(price) {
        assert.equal(price, tokenPrice, 'token price is correct');
      });
    });

    it('facilitates token buying', function() {
      return DappToken.deployed().then(function(instance) {
        // Grab token instance first
        tokenInstance = instance;             //access to token contract instance 
        return DappTokenSale.deployed();
      }).then(function(instance) {
        // Then grab token sale instance
        tokenSaleInstance = instance;         //access to token sale instance 
        // Provision 75% of all tokens (total supply) to the token sale
        return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin })
      }).then(function(receipt) {
        numberOfTokens = 10;
        return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice })
      }).then(function(receipt) {
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
        assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
        assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
        return tokenSaleInstance.tokensSold(); //check that the tokens  are sold
      }).then(function(amount) {
        //check that the number of token sold t=is the same as the number of tokens bought 
        assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
        return tokenInstance.balanceOf(buyer);
      }).then(function(balance) {
        assert.equal(balance.toNumber(), numberOfTokens);
        return tokenInstance.balanceOf(tokenSaleInstance.address);
      }).then(function(balance) {
        assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
        // Try to buy tokens different from the ether value
        return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
        return tokenSaleInstance.buyTokens(800000, { from: buyer, value: numberOfTokens * tokenPrice })
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
      });
    });

    it('ends token sale', function() {
      return DappToken.deployed().then(function(instance) {
        // Grab token instance first
        tokenInstance = instance;
        return DappTokenSale.deployed();
      }).then(function(instance) {
        // Then grab token sale instance
        tokenSaleInstance = instance;
        // Try to end sale from account other than the admin
        return tokenSaleInstance.endSale({ from: buyer });
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert' >= 0, 'must be admin to end sale'));
        // End sale as admin
        return tokenSaleInstance.endSale({ from: admin });
      }).then(function(receipt) {
        return tokenInstance.balanceOf(admin);
      }).then(function(balance) {
        assert.equal(balance.toNumber(), 999990, 'returns all unsold dapp tokens to admin');
        //check that token price was  reset when self destruct was called 
        //return tokenSaleInstance.tokenPrice();
        // Check that the contract has no balance
        balance = web3.eth.getBalance(tokenSaleInstance.address)
        assert.equal(balance.toNumber(), 0);
      });
    });
  });