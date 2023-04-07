// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault {
  mapping(address=>uint) public deposited;
  address public immutable token;

  constructor(address _token) {
    token = _token;
  }

  function deposit(address user, uint amount) public {
    require(IERC20(token).transferFrom(msg.sender, address(this), amount), "transfer from fail");
    deposited[user] += amount;
  }

  function permitDeposit(address user, uint amount, uint deadline, uint8 v, bytes32 r, bytes32 s) external{
    IERC20Permit(token).permit(msg.sender, address(this), amount, deadline, v, r, s);
    deposit(user, amount);
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