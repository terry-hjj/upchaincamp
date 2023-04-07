// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract My2612 is ERC20Permit {
  constructor() ERC20("MYERC2612", "M2612") ERC20Permit("ERC2612") {
    _mint(msg.sender, 10000 * 10 ** 18);
  }
}