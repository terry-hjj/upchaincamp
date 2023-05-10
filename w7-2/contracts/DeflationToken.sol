//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract DeflationToken is ERC20 {

  uint public ONE = 1e18;
  uint private factor = ONE;
  uint private lastRebaseTs; 

  constructor() ERC20("DeflationToken", "DT") {
    _mint(msg.sender, 100000*1e18);
    lastRebaseTs = block.timestamp; 
  }

  function totalSupply() public override view 
  returns(uint256) {
    return super.totalSupply() * factor /ONE;
  }

  function rebase() external {
    if (block.timestamp - lastRebaseTs > 365 days) {
      factor = factor * 99 / 100;
      lastRebaseTs = block.timestamp;
    }
  }

  function balanceOf(address account) public override view
  returns(uint256) {
    return super.balanceOf(account) * factor / ONE;
  }

  function _transfer(address from, address to, uint256 amount) internal 
  override virtual {
    uint under = amount * ONE / factor;
    super._transfer(from, to, under);
  }
}