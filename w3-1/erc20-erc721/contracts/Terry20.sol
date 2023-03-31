// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Terry20 is ERC20 {

  constructor() ERC20("TERRYERC20", "TE") {
    _mint(msg.sender, 100000 * 10 ** 18);
  }
}