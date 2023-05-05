// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IUniswapV2Router02.sol";
import "./IMasterChef.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MyTokenMarket {
    using SafeERC20 for IERC20;

    address public token;
    address public router;
    address public weth;
    address public sushi;
    address public masterChef;
    uint public deposited;

    constructor(address _token, address _router, address _weth, address _sushi, address _masterChef) {
        token = _token;
        router = _router;
        weth = _weth;
        sushi = _sushi;
        masterChef = _masterChef;
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
            address(this), // msg.sender,
            block.timestamp
        );

        uint amount = IERC20(token).balanceOf(address(this));
        
        IERC20(token).safeApprove(masterChef, amount);
        IMasterChef(masterChef).deposit(0, amount);
        deposited += amount;
    }

    function withdraw() public {
        IMasterChef(masterChef).withdraw(0, deposited);
        IERC20(token).safeTransfer(msg.sender, deposited);

        uint amount = IERC20(sushi).balanceOf(address(this));
        IERC20(sushi).safeTransfer(msg.sender, amount);
    }
}