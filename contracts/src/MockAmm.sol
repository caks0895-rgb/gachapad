// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IERC20Mint {
    function transferFrom(address, address, uint256) external returns (bool);
    function transfer(address, uint256) external returns (bool);
    function mint(address, uint256) external;
    function decimals() external view returns (uint8);
}

contract MockAmm {
    mapping(address => uint256) public priceUsd8;
    address public owner;
    error NotOwner();
    constructor() { owner = msg.sender; }
    function setPrice(address token, uint256 usd8) external {
        if (msg.sender != owner) revert NotOwner();
        priceUsd8[token] = usd8;
    }
    function swapExactIn(address tokenIn, address tokenOut, uint256 amountIn, address to)
        external returns (uint256 amountOut)
    {
        require(IERC20Mint(tokenIn).transferFrom(msg.sender, address(this), amountIn), "in");
        uint256 px = priceUsd8[tokenOut];
        if (px == 0) px = 100e8;
        uint8 inDec = IERC20Mint(tokenIn).decimals();
        uint256 usd8 = (amountIn * 1e8) / (10 ** inDec);
        amountOut = (usd8 * 1e18) / px;
        IERC20Mint(tokenOut).mint(to, amountOut);
    }
}
