import { ethers } from "hardhat";

async function main() {
  const Bank = await ethers.getContractFactory("Bank");
  const bank = await Bank.deploy();
  await bank.deployed();
  console.log(`Bank deployed at ${bank.address}`);
}

main().catch(error=>{
  console.error(error);
  process.exitCode = 1;
});
