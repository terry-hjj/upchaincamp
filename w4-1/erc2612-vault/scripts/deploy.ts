import { ethers } from "hardhat";

async function main() {


  const My2612 = await ethers.getContractFactory("My2612");
  const my2612 = await My2612.deploy();
  await my2612.deployed();
  console.log(`My2612  deployed to ${my2612.address}`);

  const Vault = await ethers.getContractFactory("Vault");
  const vault = await Vault.deploy(my2612.address);
  await vault.deployed();
  console.log(`Vault  deployed to ${vault.address}`);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*
My2612  deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
Vault  deployed to 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
*/