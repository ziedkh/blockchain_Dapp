pragma solidity ^0.4.2;

contract DappToken {
//constructor 
//set token number of token 
//read the total number of token 
   uint256 public totalSupply; //solidity get function for free !!!!
  
   function DappToken() public{ //stolidity declaration 
         totalSupply = 1000000; // var accessible like class var ==> right to the blockchain 

   }
  
}