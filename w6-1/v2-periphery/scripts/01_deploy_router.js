const { ethers, network } = require("hardhat");

const { writeAddr } = require('./artifact_log.js');


let Factory = require(`../../v2-core/deployments/${network.name}/UniswapV2Factory.json`)


let factoryAddr = Factory.address;
console.log("factoryAddr: ", factoryAddr);

async function main() {
  let [owner]  = await ethers.getSigners();
  
  WETH = await ethers.getContractFactory("WETH9");
  weth = await WETH.deploy();
  await weth.deployed();
  console.log("WETH address: ", weth.address);
  await writeAddr(weth.address, "WETH", network.name);

  Router = await ethers.getContractFactory("UniswapV2Router02");
  router = await Router.deploy(factoryAddr, weth.address);
  await router.deployed();

  console.log("Router address: ", router.address);
  await writeAddr(router.address, "Router", network.name);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

