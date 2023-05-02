// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MyTokenMarket {
    using SafeERC20 for IERC20;

    address public token;
    address public router;
    address public weth;

    constructor(address _token, address _router, address _weth) {
        token = _token;
        router = _router;
        weth = _weth;
    }

    function AddLiquidity(uint tokenAmount) public payable{
        IERC20(token).safeTransferFrom(msg.sender, address(this), tokenAmount);
        IERC20(token).safeApprove(router, tokenAmount);

        IUniswapV2Router02(router).addLiquidityETH{value: msg.value}(
            token,
            tokenAmount,
            0,
            0,
            msg.sender,
            block.timestamp
        );
    }

    function buyToken(uint minTokenAmount) public payable{
        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = token;

        IUniswapV2Router02(router).swapExactETHForTokens{value: msg.value}(
            minTokenAmount,
            path,
            msg.sender,
            block.timestamp
        );
    }
}