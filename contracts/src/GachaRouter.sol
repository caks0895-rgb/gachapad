// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IERC20 {
    function balanceOf(address) external view returns (uint256);
    function transfer(address, uint256) external returns (bool);
    function transferFrom(address, address, uint256) external returns (bool);
    function approve(address, uint256) external returns (bool);
}
interface IPadPoints { function mintFromSwap(address account, uint256 usdVolume, address tokenOut) external; }
interface IMockAmm {
    function swapExactIn(address tokenIn, address tokenOut, uint256 amountIn, address to) external returns (uint256 amountOut);
}

contract GachaRouter {
    uint16 public constant FEE_BPS = 50;
    uint16 public constant PRIZE_SHARE_BPS = 8000;
    uint16 public constant TREASURY_SHARE_BPS = 1500;
    uint16 public constant REFERRAL_SHARE_BPS = 500;
    address public owner;
    IERC20 public quote;
    IPadPoints public points;
    IMockAmm public amm;
    address public prizeSink;
    address public treasury;
    address public referralSink;
    uint8 public quoteDecimals = 6;
    event Swapped(address indexed user, address indexed tokenOut, uint256 amountIn, uint256 fee, uint256 amountOut, uint256 points);
    error NotOwner();
    error Zero();
    error TransferFailed();
    modifier onlyOwner() { if (msg.sender != owner) revert NotOwner(); _; }
    constructor(address quote_, address points_, address amm_, address prizeSink_, address treasury_, address referralSink_) {
        owner = msg.sender;
        quote = IERC20(quote_);
        points = IPadPoints(points_);
        amm = IMockAmm(amm_);
        prizeSink = prizeSink_;
        treasury = treasury_;
        referralSink = referralSink_;
    }
    function setAmm(address next) external onlyOwner { amm = IMockAmm(next); }
    function swapExactIn(address tokenOut, uint256 amountIn, uint256 minOut) external returns (uint256 amountOut) {
        if (amountIn == 0) revert Zero();
        if (!quote.transferFrom(msg.sender, address(this), amountIn)) revert TransferFailed();
        uint256 fee = (amountIn * FEE_BPS) / 10_000;
        uint256 prizeCut = (fee * PRIZE_SHARE_BPS) / 10_000;
        uint256 treasuryCut = (fee * TREASURY_SHARE_BPS) / 10_000;
        uint256 referralCut = fee - prizeCut - treasuryCut;
        if (!quote.transfer(prizeSink, prizeCut)) revert TransferFailed();
        if (!quote.transfer(treasury, treasuryCut)) revert TransferFailed();
        if (!quote.transfer(referralSink, referralCut)) revert TransferFailed();
        uint256 tradeable = amountIn - fee;
        quote.approve(address(amm), tradeable);
        amountOut = amm.swapExactIn(address(quote), tokenOut, tradeable, msg.sender);
        require(amountOut >= minOut, "slippage");
        uint256 usdVolume = amountIn / (10 ** quoteDecimals);
        if (usdVolume == 0 && amountIn > 0) usdVolume = 1;
        points.mintFromSwap(msg.sender, usdVolume, tokenOut);
        emit Swapped(msg.sender, tokenOut, amountIn, fee, amountOut, usdVolume);
    }
}
