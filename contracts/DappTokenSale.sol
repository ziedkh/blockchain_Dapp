pragma solidity ^0.4.2;

import "./DappToken.sol";

contract DappTokenSale {
    address admin;  //state variable // does not have the public visibility ==> not expose the address of the admin  
    DappToken public tokenContract; // fonction that return the address of the Dapptoken that we set inside of the constructor
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(
        address _buyer,
        uint256 _amount
    );

    //constructor called when the contract called 
    function DappTokenSale(DappToken _tokenContract/* referance the dapp token*/, uint256 _tokenPrice) public {
        //assign an admin 
        //token contract
        //token price

        admin = msg.sender; // access to the address of the  person who deploy the contract
        tokenContract = _tokenContract; // 
        tokenPrice = _tokenPrice;
    }
//***************     build up the fonctonality  ****************/

    //check dapp hubs ds-math library 
    function multiply(uint x, uint y) internal /* called internally in the contract */ pure /* not actually creating a transaction */returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {// expose this to public  ,payable  we wanna that s.o send ether  with this transaction 
      

      //require that value is eqaul to tokens 
      //requiure thatv the contract has enough tokens 
      //require that a transfer is successful 
     
      //keep track of tokenSold  

      //trigger sell event 


        require(msg.value == multiply(_numberOfTokens, tokenPrice)); // msg.value is the amount of wei that this function is sending 
        require(tokenContract.balanceOf(this) >= _numberOfTokens); //  this ref for the smart contract 
        require(tokenContract.transfer(msg.sender, _numberOfTokens));// the actual buy function 

        tokensSold += _numberOfTokens; // increamant the number of tokens 
       Sell(msg.sender, _numberOfTokens);
    }
   // ending token sale 
    function endSale() public {
        
         // require that only the admin can do this
         require(msg.sender == admin);

         //transfer reaming dapp tokens to admin 
         require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));

        //destroy tokens
   
       
        // Just transfer the balance to the admin
        admin.transfer(address(this).balance);
    }
}