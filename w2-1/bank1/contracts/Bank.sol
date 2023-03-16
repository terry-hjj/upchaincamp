//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

contract Bank {
  mapping(address => uint) public balances;
  address owner;

  constructor() {
    owner = msg.sender;
  }

  function withdrawAll() public {
    require(msg.sender == owner, "you cannot withdrawAll.");
    // console.log("balance: ", address(this).balance);
    (bool success,) = msg.sender.call{value: address(this).balance}(new bytes(0));
    require(success, "withdrawAll fail.");
  }

  function withdraw(uint amount) public {
    require(amount <= balances[msg.sender], "not enough balance."); // check
    // console.log("withdraw log: ", msg.sender, " : ", amount);
    balances[msg.sender] -= amount; // effect
    (bool success,) = msg.sender.call{value: amount}(new bytes(0)); // interaction
    require(success, "withdraw fail.");
    // payable(msg.sender).transfer(amount);
  }

  function myBalance() public view returns(uint) {
    return balances[msg.sender];
  }


  receive() external payable {
    // console.log("receive running, msg.sender: ", msg.sender, ", msg.value: ", msg.value);
    balances[msg.sender] += msg.value;
  }

  fallback() external payable {
    // console.log("fallback running, msg.sender: ", msg.sender, ", msg.value: ", msg.value);
    balances[msg.sender] += msg.value;
  }
}