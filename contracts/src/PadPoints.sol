// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract PadPoints {
    string public constant name = "Gachapad Points";
    string public constant symbol = "PAD";
    uint8 public constant decimals = 0;
    address public owner;
    address public router;
    address public vault;
    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public lifetimeSwapUsd;
    mapping(address => uint256) public lastCheckIn;
    mapping(address => uint256) public streak;
    mapping(address => mapping(uint8 => bool)) public missionClaimed;
    mapping(address => uint256) public distinctTickers;
    mapping(address => mapping(address => bool)) public seenTicker;
    mapping(address => uint256) public lastPrizeAt;
    uint256 public totalSupply;
    event Transfer(address indexed from, address indexed to, uint256 value);
    event CheckIn(address indexed account, uint256 awarded, uint256 streak);
    event Mission(address indexed account, uint8 id, uint256 awarded);
    error NotOwner();
    error NotRouter();
    error NotVault();
    error Soulbound();
    error TooEarly();
    error AlreadyClaimed();
    error MissionClosed();
    modifier onlyOwner() { if (msg.sender != owner) revert NotOwner(); _; }
    constructor() { owner = msg.sender; }
    function setRouter(address next) external onlyOwner { router = next; }
    function setVault(address next) external onlyOwner { vault = next; }
    function mintFromSwap(address account, uint256 usdVolume, address tokenOut) external {
        if (msg.sender != router) revert NotRouter();
        if (usdVolume == 0) return;
        lifetimeSwapUsd[account] += usdVolume;
        if (!seenTicker[account][tokenOut]) {
            seenTicker[account][tokenOut] = true;
            distinctTickers[account] += 1;
        }
        _mint(account, usdVolume);
    }
    function burnFrom(address account, uint256 amount) external {
        if (msg.sender != vault) revert NotVault();
        uint256 bal = balanceOf[account];
        require(bal >= amount, "points");
        balanceOf[account] = bal - amount;
        totalSupply -= amount;
        lastPrizeAt[account] = block.timestamp;
        emit Transfer(account, address(0), amount);
    }
    function checkIn() external returns (uint256 awarded) {
        uint256 nextAt = lastCheckIn[msg.sender] + 1 days;
        if (block.timestamp < nextAt && lastCheckIn[msg.sender] != 0) revert TooEarly();
        bool continued = lastCheckIn[msg.sender] != 0 && block.timestamp < lastCheckIn[msg.sender] + 2 days;
        uint256 nextStreak = continued ? streak[msg.sender] + 1 : 1;
        streak[msg.sender] = nextStreak;
        lastCheckIn[msg.sender] = block.timestamp;
        awarded = 15 + (nextStreak - 1) * 5;
        if (awarded > 40) awarded = 40;
        _mint(msg.sender, awarded);
        emit CheckIn(msg.sender, awarded, nextStreak);
    }
    function claimMission(uint8 id) external returns (uint256 awarded) {
        if (missionClaimed[msg.sender][id]) revert AlreadyClaimed();
        if (id == 1) { if (lifetimeSwapUsd[msg.sender] == 0) revert MissionClosed(); awarded = 50; }
        else if (id == 2) { if (distinctTickers[msg.sender] < 3) revert MissionClosed(); awarded = 80; }
        else if (id == 3) { if (lifetimeSwapUsd[msg.sender] < 100) revert MissionClosed(); awarded = 40; }
        else if (id == 4) { if (lifetimeSwapUsd[msg.sender] < 500) revert MissionClosed(); awarded = 120; }
        else if (id == 5) { if (lifetimeSwapUsd[msg.sender] < 2000) revert MissionClosed(); awarded = 400; }
        else if (id == 6) {
            if (lastPrizeAt[msg.sender] == 0 || block.timestamp < lastPrizeAt[msg.sender] + 1 days) revert MissionClosed();
            awarded = 60;
        } else { revert MissionClosed(); }
        missionClaimed[msg.sender][id] = true;
        _mint(msg.sender, awarded);
        emit Mission(msg.sender, id, awarded);
    }
    function nextCheckIn(address account) external view returns (uint256) {
        if (lastCheckIn[account] == 0) return block.timestamp;
        return lastCheckIn[account] + 1 days;
    }
    function transfer(address, uint256) external pure returns (bool) { revert Soulbound(); }
    function approve(address, uint256) external pure returns (bool) { revert Soulbound(); }
    function transferFrom(address, address, uint256) external pure returns (bool) { revert Soulbound(); }
    function _mint(address account, uint256 amount) internal {
        balanceOf[account] += amount;
        totalSupply += amount;
        emit Transfer(address(0), account, amount);
    }
}
