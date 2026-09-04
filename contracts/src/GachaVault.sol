// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IERC20 {
    function balanceOf(address) external view returns (uint256);
    function transfer(address, uint256) external returns (bool);
}
interface IPadPoints {
    function burnFrom(address account, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
}

contract GachaVault {
    address public owner;
    IPadPoints public points;
    address[] public prizeTokens;
    mapping(address => bool) public isPrize;
    mapping(address => uint256) public mockPriceUsd;
    event Pulled(address indexed user, address token, uint256 amount, uint256 pointsBurned, uint256 luckBps);
    event PrizeTokenSet(address indexed token, bool allowed, uint256 priceUsd);
    error NotOwner();
    error BadPoints();
    error EmptyVault();
    error TransferFailed();
    modifier onlyOwner() { if (msg.sender != owner) revert NotOwner(); _; }
    constructor(address points_) { owner = msg.sender; points = IPadPoints(points_); }
    function setPrizeToken(address token, bool allowed, uint256 priceUsd) external onlyOwner {
        if (allowed && !isPrize[token]) prizeTokens.push(token);
        isPrize[token] = allowed;
        mockPriceUsd[token] = priceUsd;
        emit PrizeTokenSet(token, allowed, priceUsd);
    }
    function inventory(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
    function prizeCount() external view returns (uint256) { return prizeTokens.length; }
    function previewEnvelope(uint256 pts, uint256 luckBps) public pure returns (uint256 usd8) {
        uint256 linear = pts * 4e5;
        uint256 quad = (pts * pts * 150) / 1e3;
        uint256 base = ((linear + quad) * 80) / 100;
        usd8 = (base * luckBps) / 10_000;
    }
    function pull(uint256 pointsToBurn) external returns (address token, uint256 amount, uint256 luckBps) {
        if (pointsToBurn == 0 || points.balanceOf(msg.sender) < pointsToBurn) revert BadPoints();
        luckBps = _rollLuck(pointsToBurn);
        uint256 usd8 = previewEnvelope(pointsToBurn, luckBps);
        if (usd8 == 0) revert BadPoints();
        (token, amount) = _pickAndSize(usd8);
        if (amount == 0) revert EmptyVault();
        points.burnFrom(msg.sender, pointsToBurn);
        if (!IERC20(token).transfer(msg.sender, amount)) revert TransferFailed();
        emit Pulled(msg.sender, token, amount, pointsToBurn, luckBps);
    }
    function _rollLuck(uint256 salt) internal view returns (uint256) {
        uint256 roll = uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, msg.sender, salt))) % 100;
        if (roll < 30) return 3500;
        if (roll < 65) return 7000;
        if (roll < 87) return 10000;
        if (roll < 97) return 16000;
        return 30000;
    }
    function _pickAndSize(uint256 usd8) internal view returns (address token, uint256 amount) {
        uint256 n = prizeTokens.length;
        uint256 totalBal;
        for (uint256 i; i < n; i++) {
            address t = prizeTokens[i];
            if (!isPrize[t]) continue;
            totalBal += IERC20(t).balanceOf(address(this));
        }
        if (totalBal == 0) return (address(0), 0);
        uint256 pick = uint256(keccak256(abi.encodePacked(block.prevrandao, msg.sender, usd8))) % totalBal;
        uint256 acc;
        for (uint256 i; i < n; i++) {
            address t = prizeTokens[i];
            if (!isPrize[t]) continue;
            uint256 bal = IERC20(t).balanceOf(address(this));
            acc += bal;
            if (pick < acc) {
                uint256 px = mockPriceUsd[t];
                if (px == 0) px = 100e8;
                uint256 raw = (usd8 * 1e18) / px;
                if (raw > bal) raw = bal;
                return (t, raw);
            }
        }
    }
}
