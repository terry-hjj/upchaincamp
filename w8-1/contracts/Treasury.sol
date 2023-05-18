// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Treasury {
  uint private deposited;
  address private owner;
  
  event Deposite(address from, uint amount);
  event Withdraw(address to, uint amount);

  constructor() {
    deposited = 0;
    owner = msg.sender;
  }

  function deposite() public payable {
    deposited += msg.value;
    emit Deposite(msg.sender, msg.value);
  }

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

  function changeOwner(address newOwner) public onlyOwner {
    owner = newOwner;
  }

  function withdraw(address to, uint amount) public onlyOwner {
    require(deposited >= amount, "not enough deposited");
    (bool success, ) = to.call{value: amount}(new bytes(0));
    require(success, "withdraw failed");
    emit Withdraw(to, amount);
  }
}