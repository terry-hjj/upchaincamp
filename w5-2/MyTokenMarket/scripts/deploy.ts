import { ethers } from "hardhat";

async function main() {

  const Terry20 = await ethers.getContractFactory("Terry20");
  const terry20 = await Terry20.deploy();
  await terry20.deployed();
  console.log(`Terry20 deployed to ${terry20.address}`);

  let [owner, second] = await ethers.getSigners();

  let MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");

    let routerAddr = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    let wethAddr = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

    let market = await MyTokenMarket.deploy(
        terry20.address,
        routerAddr,
        wethAddr,
    );

    await market.deployed();
    console.log("market:" + market.address);

    await terry20.approve(market.address, ethers.constants.MaxUint256);

    let ethAmount = ethers.utils.parseUnits("100", 18);
    let tx = await market.AddLiquidity(ethers.utils.parseUnits("100000", 18), { value: ethAmount });
    await tx.wait();
    console.log("添加流动性");

    let b = await terry20.balanceOf(owner.address);
    console.log("持有token:" + ethers.utils.formatUnits(b, 18));

    let buyEthAmount = ethers.utils.parseUnits("10", 18);
    tx = await market.buyToken("0", { value: buyEthAmount });
    await tx.wait();

    b = await terry20.balanceOf(owner.address);
    console.log("购买到:" + ethers.utils.formatUnits(b, 18));

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// UniswapV2Factory address:  0x5FbDB2315678afecb367f032d93F642f64180aa3
// UniswapV2Factory code hash:  0xaae7dc513491fb17b541bd4a9953285ddf2bb20a773374baecc88c4ebada0767
// UniswapV2Factory address:  0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

// WETH deployed to  0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

// Router address:  0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9