var DappToken = artifacts.require("./DappToken.sol");


contract('DappToken', function(accounts){
    var tokenInstance;
    
    it('initializes the contract with the correct values', function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name,'Dapp token','has the correct name');
            return tokenInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol, 'Dapp', 'has the correct symbol');
            return tokenInstance.standard();
        }).then(function(standard){
            assert.equal(standard, 'v1.0','has the correct standrad');
        });
    });

    it('allocates the initial supply supply upon deployement',function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();

        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(),1000000,'sets the total supply to 1,000,000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(),1000000,'it allocates the initial supply to the admin account');

        });
    });

    it ('transfer token ownership', function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1],999999999999999);
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
            return tokenInstance.transfer.call(accounts[1],25000,{from : accounts[0]});
        }).then(function(success){
            assert.equal(success,true, 'it return true ');
            return tokenInstance.transfer(accounts[1],25000,{from :accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1,'triggeers one event');
            assert.equal(receipt.logs[0].event, 'Transfer','should be the "transfer" event ');
            assert.equal(receipt.logs[0].args._from,accounts[0],'logs the account the tokens are tansfered from');
            assert.equal(receipt.logs[0].args._to, accounts[1],'logs the account the tokens are transfered to');
            assert.equal(receipt.logs[0].args._value,25000,'logs the transffer amount');
            return tokenInstance.balanceOf(accounts[1]);

        }).then(function(balance){   
            assert.equal(balance.toNumber(),25000,'adds the amount to the receiving account');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){
            assert.equal(balance.toNumber(),975000,'deducts the amount from the sending account');
        });
    });









});