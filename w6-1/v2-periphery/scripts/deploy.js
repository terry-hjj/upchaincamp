const { ethers } = require("hardhat");

async function main() {
  
  Router = await ethers.getContractFactory("UniswapV2Router02");
  router = await Router.deploy("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"); // factory addr, weth addr
  await router.deployed();

  console.log("Router address: ", router.address);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
