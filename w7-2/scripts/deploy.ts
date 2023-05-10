import { ethers } from "hardhat";

async function main() {
  const DeflationToken = await ethers.getContractFactory("DeflationToken");
  const deflationToken = await DeflationToken.deploy();
  await deflationToken.deployed();
  console.log(`DeflationToken deployed to ${deflationToken.address}`);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// DeflationToken deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3