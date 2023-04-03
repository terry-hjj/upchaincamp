// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

interface TokenRecipient {
    function tokensReceived(address sender, uint amount) external returns (bool);
}

contract MyErc20update is  ERC20Upgradeable {
  using Address for address;

  function initialize() external initializer {
    __ERC20_init("MyERC20UPD", "ME");
    _mint(msg.sender, 100000 * 10 ** 18);
  }

  function transferWithCallback(address recipient, uint256 amount) external returns (bool) {
    _transfer(msg.sender, recipient, amount);
    if (recipient.isContract()) {
      bool rv = TokenRecipient(recipient).tokensReceived(msg.sender, amount);
      require(rv, "No tokensReceived");
    }
    return true;
  }
}