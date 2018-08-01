pragma solidity ^0.4.2;

contract DappToken {
//constructor 
//set token number of token 
//read the total number of token 

//name
//symbol
   string public name ="Dapp token";
   string public symbol ="Dapp";
   string public standard ='v1.0';

   uint256 public totalSupply; //solidity get function for free !!!!

   event Transfer(
       address indexed _from,
       address indexed _to,
       uint256 _value
   );

   // approve 
   event Approval
   (
       address indexed _owner,
       address indexed _spender,
       uint256 _value  );
  
   mapping(address=> uint256)public balanceOf; //how has each token 
   mapping(address => mapping(address => uint256) ) public allowance ;
     
    //allowance 

    function DappToken (uint256 _initialSupply) public{    //stolidity declaration 
         balanceOf[msg.sender] = _initialSupply;
         totalSupply = _initialSupply; // var accessible like class var ==> right to the blockchain 
         //allocate the initial supply
   }

   //transfer
   
   function transfer(address _to, uint256 _value) public returns(bool sucess){
        //exception if account not enough
         require(balanceOf[msg.sender] >= _value);
        //transfer the balance 
          balanceOf[msg.sender] -= _value;
          balanceOf[_to] += _value;
       //transfer event     
        Transfer(msg.sender , _to , _value);

        //return boolean
        return true; 
     

   }

    //delegated transfer 
    //************************************************************ */
    // 2 step  process: 1-allows the account to approuve a transaction 
    //                  2- handle the delegate transfer 
    // approve : allow s.o to spend tokens (exchange )  // Approval event 
    // transferForm : after approuving 
    //allowance : the amount of tokens approuved to spend 
        

     //Approve event  : i'm account A i would approuve the amount of _value tokens exchanges 
     function approve(address _spender , uint256 _value)public returns (bool sucess){
         // allowance 
        allowance[msg.sender][_spender] = _value; 
         //Approve event 
         Approval(msg.sender, _spender, _value);

        return true;

     }





         function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
     // **********************  to do ****************************
            // require from account has enough tokens 
           //   return bool 
           // transfer event 
           // change the balance 
           // update  the allowance 
          
           // require allowance is big enough 

        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        Transfer(_from, _to, _value);

        return true;
    }
  
}