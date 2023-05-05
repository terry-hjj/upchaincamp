pragma solidity =0.6.6;

import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol';

import './libraries/UniswapV2Library.sol';
import './interfaces/IUniswapV2Router02.sol';
import './interfaces/IERC20.sol';
import './interfaces/IWETH.sol';


contract FlashSwap is IUniswapV2Callee {
    
    address immutable factory;
    address immutable router2;
    address immutable owner;

    constructor(address _factory, address _router2) public {
        factory = _factory;
        router2 = _router2;
        owner = msg.sender;
    }


    // pair1  1 A = 2 B,  pair2 1.5 A  = 2 B  
    // 从 pair1 借出来 2 个 B, 在pair2兑换 1.5A， 还回 1 个 A 给 pair1
    function flashSwap(address pair, address borrowToken) external {
        address token0 = IUniswapV2Pair(pair).token0();
        
        if(token0 == borrowToken) {
            IUniswapV2Pair(pair).swap(2e18, 0, address(this), new bytes(0x01));
        } else {
            IUniswapV2Pair(pair).swap(0, 2e18, address(this), new bytes(0x01));
        }
    }



    function uniswapV2Call(address sender, uint amount0, uint amount1, bytes calldata data) external override {
        require(amount0 == 0 || amount1 == 0, "invalid amounts"); // this strategy is unidirectional
        
        // msg.sender is pair1 
        address token0 = IUniswapV2Pair(msg.sender).token0();
        address token1 = IUniswapV2Pair(msg.sender).token1();

        require(msg.sender == UniswapV2Library.pairFor(factory, token0, token1), "invalid caller"); // ensure that msg.sender is actually a V2 pair

        uint balance0 = IERC20(token0).balanceOf(address(this));
        uint balance1 = IERC20(token1).balanceOf(address(this));

        address[] memory path = new address[](2);
        uint amountRequired ;

        // 收到了 token0,  兑换为 token1
        if (balance0 > 0) {

            path[0] = token1;
            path[1] = token0;
            amountRequired = UniswapV2Library.getAmountsIn(factory, balance0, path)[0];
            
            IERC20(token0).approve(router2, uint(-1));

            path[0] = token0;
            path[1] = token1;
            uint[] memory amounts = IUniswapV2Router02(router2).swapExactTokensForTokens(balance0, 0, path, address(this), block.timestamp);

            uint amountReceived = amounts[1];

            require(amountReceived > amountRequired, "un profitable 1");

            assert(IERC20(token1).transfer(msg.sender, amountRequired)); // return token1 to V2 pair

            IERC20(token1).transfer(owner, amountReceived - amountRequired); // keep the rest! (tokens)
        }

        // 收到了 token1, 兑换为 token0
        if (balance1 > 0) {

            path[0] = token0;
            path[1] = token1;
            amountRequired = UniswapV2Library.getAmountsIn(factory, balance1, path)[0];


            path[0] = token1;
            path[1] = token0;
            IERC20(token1).approve(router2, uint256(-1));
            uint[] memory amounts = IUniswapV2Router02(router2).swapExactTokensForTokens(balance1, 0, path, address(this), block.timestamp);
            uint amountReceived = amounts[1];

            require(amountReceived > amountRequired, "unprofitable");
            require(IERC20(token0).transfer(msg.sender, amountRequired)); // return token0 to V2 pair

            IERC20(token0).transfer(owner, amountReceived - amountRequired); // keep the rest! (tokens)
        }

    }
}
