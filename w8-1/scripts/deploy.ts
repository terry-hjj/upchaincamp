import { ethers } from "hardhat";

async function main() {
  

  const Treasury = await ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy();
  await treasury.deployed();
  console.log(`Treasury deployed to ${treasury.address}`);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Treasury deployed to 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9  --localhost
// Treasury deployed to 0x0aC28c0AdCaCd92cF13450fd1045520636c945b4  --goerli