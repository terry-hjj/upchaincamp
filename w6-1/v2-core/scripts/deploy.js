let { ethers } = require("hardhat");



async function main() {
    let [owner, second] = await ethers.getSigners();

    let UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");

    let f = await UniswapV2Factory.deploy(owner.address);
    await f.deployed();
    console.log("UniswapV2Factory address: ", f.address);


    let codeHash = await f.INIT_CODE_PAIR_HASH();
    console.log("UniswapV2Factory code hash: ", codeHash);

    let f2 = await UniswapV2Factory.deploy(owner.address);
    await f2.deployed();
    console.log("UniswapV2Factory address: ", f2.address);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });