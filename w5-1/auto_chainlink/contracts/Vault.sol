// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault {
  address token;
  mapping(address=>uint) public deposited;
  int total_deposited_exclude_owner; // 除开owner的余额之外的存款总额
  address owner;

  constructor(address _token) {
    token = _token;
    owner = msg.sender;
    total_deposited_exclude_owner = 0;
  }

  function deposite(address user, uint amount) public {
    require(IERC20(token).transferFrom(msg.sender, address(this), amount), "transfer fail.");
    deposited[user] += amount;
    total_deposited_exclude_owner += int(amount);
  }

  error NoEnoughBalance();
  function withdraw(uint amount) public {
    if (amount > deposited[msg.sender]) {
      revert NoEnoughBalance();
    }
    require(IERC20(token).transfer(msg.sender, amount), "transfer fail.");
    deposited[msg.sender] -= amount;
    total_deposited_exclude_owner -= int(amount);
  }

  function above100moveHalfToOwner() external {
    if (total_deposited_exclude_owner > 100 * 1e18) {
      int needMove = total_deposited_exclude_owner / 2;
      total_deposited_exclude_owner -= needMove;
      deposited[owner] += uint(needMove);
    }
  }
}