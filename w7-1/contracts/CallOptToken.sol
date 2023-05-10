// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract CallOptToken is ERC20, Ownable {
  using SafeERC20 for IERC20;

  address public usdcToken;
  uint public settlementTime;
  uint public constant during = 1 days;
  uint price;

  constructor(address usdc) ERC20("CallOptToken", "COPT") {
    usdcToken = usdc;
    price = 5000;
    settlementTime = block.timestamp + 10;
  }

  function mint() external payable onlyOwner {
    _mint(msg.sender, msg.value);
  }

  function settlement(uint amount) external {
    require(block.timestamp >= settlementTime && block.timestamp < settlementTime + during, "invalid time");
    IERC20(usdcToken).safeTransferFrom(msg.sender, address(this), price * amount);
    _burn(msg.sender, amount);
  }

  function safeTransferETH(address to, uint value) internal {
    (bool success, ) = to.call{value: value}(new bytes(0));
    require(success, "safe transfer ETH failed");
  }

  function burnAll() external onlyOwner {
    require(block.timestamp >= settlementTime + during, "not end");
    uint usdcAmount = IERC20(usdcToken).balanceOf(address(this));
    IERC20(usdcToken).safeTransfer(msg.sender, usdcAmount);

    selfdestruct(payable(msg.sender));
  }
}