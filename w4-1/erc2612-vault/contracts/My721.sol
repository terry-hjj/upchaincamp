// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract My721 is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("MyNFT-A", "MN"){}

  function mint(address user, string memory tokenURI) public
  returns (uint) {
    uint newTokenId = _tokenIds.current();
    _mint(user, newTokenId);
    _setTokenURI(newTokenId, tokenURI);
    _tokenIds.increment();
    return newTokenId;
  }
}