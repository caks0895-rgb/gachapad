// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {PadPoints} from "../src/PadPoints.sol";
import {GachaVault} from "../src/GachaVault.sol";
import {GachaRouter} from "../src/GachaRouter.sol";
import {MockERC20} from "../src/MockERC20.sol";
import {MockAmm} from "../src/MockAmm.sol";

/// forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast --private-key $PRIVATE_KEY
contract DeployScript {
    function run() external {
        address deployer = msg.sender;
        MockERC20 usdc = new MockERC20("Mock USDC", "mUSDC", 6);
        MockERC20 nvda = new MockERC20("Mock NVDAc", "NVDAc", 18);
        MockERC20 aapl = new MockERC20("Mock AAPLc", "AAPLc", 18);
        MockERC20 meta = new MockERC20("Mock METAc", "METAc", 18);
        MockERC20 goog = new MockERC20("Mock GOOGLc", "GOOGLc", 18);
        MockAmm amm = new MockAmm();
        amm.setPrice(address(nvda), 22659e6);
        amm.setPrice(address(aapl), 32632e6);
        amm.setPrice(address(meta), 60597e6);
        amm.setPrice(address(goog), 34058e6);
        PadPoints points = new PadPoints();
        GachaVault vault = new GachaVault(address(points));
        points.setVault(address(vault));
        GachaRouter router = new GachaRouter(address(usdc), address(points), address(amm), address(vault), deployer, deployer);
        points.setRouter(address(router));
        vault.setPrizeToken(address(nvda), true, 22659e6);
        vault.setPrizeToken(address(aapl), true, 32632e6);
        vault.setPrizeToken(address(meta), true, 60597e6);
        vault.setPrizeToken(address(goog), true, 34058e6);
        usdc.mint(deployer, 1_000_000e6);
        nvda.mint(address(vault), 50e18);
        aapl.mint(address(vault), 50e18);
        meta.mint(address(vault), 20e18);
        goog.mint(address(vault), 40e18);
    }
}
