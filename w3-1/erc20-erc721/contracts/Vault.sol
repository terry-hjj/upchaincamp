// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault {
  address token;
  mapping(address=>uint) public deposited;

  constructor(address _token) {
    token = _token;
  }

  function deposite(address user, uint amount) public {
    require(IERC20(token).transferFrom(msg.sender, address(this), amount), "transfer fail.");
    deposited[user] += amount;
  }

  error NoEnoughBalance();
  function withdraw(uint amount) public {
    if (amount > deposited[msg.sender]) {
      revert NoEnoughBalance();
    }
    require(IERC20(token).transfer(msg.sender, amount), "transfer fail.");
    deposited[msg.sender] -= amount;
  }
}