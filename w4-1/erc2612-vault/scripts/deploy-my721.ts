import { ethers } from "hardhat";

async function main() {


  const My721 = await ethers.getContractFactory("My721");
  const my721 = await My721.deploy();
  await my721.deployed();
  console.log(`My721  deployed to ${my721.address}`);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// My721  deployed to 0x9A676e781A523b5d0C0e43731313A708CB607508