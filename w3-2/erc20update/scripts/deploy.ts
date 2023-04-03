import { ethers, upgrades } from "hardhat";
import { getImplementationAddress }  from "@openzeppelin/upgrades-core";



// $ npx hardhat run scripts/deploy.ts --network goerli
// MyErc20 deployed to 0xf73beCD61Ff662CC6E78A6A3466011E8abe55610


async function main() {

  // first deploy
  const MyErc20 = await ethers.getContractFactory("MyErc20");
  const myErc20 = await upgrades.deployProxy(MyErc20);
  await myErc20.deployed();
  console.log(
    `MyErc20 deployed to ${myErc20.address}`
  );

  // // upgrade
  // const MyErc20update = await ethers.getContractFactory("MyErc20update");
  // const update = await upgrades.upgradeProxy("0xf73beCD61Ff662CC6E78A6A3466011E8abe55610", MyErc20update);
  // let currentImplAddress = await getImplementationAddress(ethers.provider, update.address);
  // console.log(`currentImplAddress: ${currentImplAddress}`);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


