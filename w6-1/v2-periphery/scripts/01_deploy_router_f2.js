const { ethers, network } = require("hardhat");

const { writeAddr } = require('./artifact_log.js');


let Factory = require(`../../v2-core/deployments/${network.name}/UniswapV2Factory2.json`)
let WETH = require(`../deployments/${network.name}/WETH.json`)


let factoryAddr = Factory.address;
console.log("factoryAddr: ", factoryAddr);

async function main() {
  let [owner]  = await ethers.getSigners();
  
  Router = await ethers.getContractFactory("UniswapV2Router02");
  router = await Router.deploy(factoryAddr, WETH.address);
  await router.deployed();

  console.log("Router address: ", router.address);
  await writeAddr(router.address, "Router_2", network.name);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

