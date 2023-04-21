// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./automation/AutomationCompatible.sol";

interface IBank {
  function above100moveHalfToOwner() external;
}

contract UpKeep is AutomationCompatible {
  address public immutable token;
  address public immutable bank;

  constructor(address _token, address _bank) {
    token = _token;
    bank = _bank;
  }

  function checkUpkeep(bytes calldata checkData)
  external view override
  returns (bool upkeepNeeded, bytes memory performData) {
    upkeepNeeded = true;
  }

  function performUpkeep(bytes calldata performData) external override {
    IBank(bank).above100moveHalfToOwner();
  }
}