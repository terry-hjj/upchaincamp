import { ethers } from "hardhat";


async function main() {
  const USDC = await ethers.getContractFactory("USDC");
  const usdc = await USDC.deploy();
  await usdc.deployed();
  console.log(`USDC deployed to ${usdc.address}`);

  const CallOptToken = await ethers.getContractFactory("CallOptToken");
  const callOptToken = await CallOptToken.deploy(usdc.address);
  await callOptToken.deployed();
  console.log(`CallOptToken deployed to ${callOptToken.address}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// USDC deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
// CallOptToken deployed to 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512