// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NftExchange is IERC721Receiver {

    function onERC721Received(address operator, address from, uint tokenId, bytes calldata data)
    external override
    returns (bytes4) {
        return this.onERC721Received.selector;
    }


    address public immutable token;
    address public immutable nftToken;
    mapping(uint=>uint) tokenIdPrice;
    mapping(uint=>address) tokenIdSeller;

    constructor(address _token, address _nftToken) {
        token = _token;
        nftToken = _nftToken;
    }

    // 需先在721合约上授权当前合约有权转移该NFT:  IERC721(nftToken).approve(address(this), tokenId)
    function list(uint tokenId, uint amount) external {
        IERC721(nftToken).safeTransferFrom(msg.sender, address(this), tokenId, "");
        tokenIdPrice[tokenId] = amount;
        tokenIdSeller[tokenId] = msg.sender;
    }

    error TooLowPrice();
    error SoldOut();
    // 需先在20合约上授权当前合约有权转移买方代币: IERC20(token).approve(address(this), amount)
    function buy(uint tokenId, uint amount) external {
        if (amount < tokenIdPrice[tokenId]) {
            revert TooLowPrice();
        }
        if (IERC721(nftToken).ownerOf(tokenId) != address(this)) {
            revert SoldOut();
        }
        
        IERC20(token).transferFrom(msg.sender, tokenIdSeller[tokenId], tokenIdPrice[tokenId]);
        IERC721(nftToken).transferFrom(address(this), msg.sender, tokenId);

        tokenIdSeller[tokenId] = address(0);
        tokenIdPrice[tokenId] = 0;
    }

}