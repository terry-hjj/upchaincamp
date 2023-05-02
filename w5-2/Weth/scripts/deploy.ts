import { ethers } from "hardhat";

async function main() {
  const WETH = await ethers.getContractFactory("WETH");
  const weth = await WETH.deploy();
  await weth.deployed();
  console.log("WETH deployed to ", weth.address);
}

main().catch(error=>{
  console.error(error);
  process.exitCode = 1;
});