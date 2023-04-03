// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract MyErc20 is  ERC20Upgradeable {

  function initialize() external initializer {
    __ERC20_init("MyERC20", "ME");
    _mint(msg.sender, 100000 * 10 ** 18);
  }
}