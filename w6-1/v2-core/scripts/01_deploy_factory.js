let { ethers } = require("hardhat");

const { writeAddr } = require('./artifact_log.js');

async function main() {
    let [owner, second] = await ethers.getSigners();

    let UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
    let f = await UniswapV2Factory.deploy(owner.address);
    await f.deployed();
    console.log("UniswapV2Factory address: ", f.address);
    await writeAddr(f.address, "UniswapV2Factory", network.name);

    let codeHash = await f.INIT_CODE_PAIR_HASH();
    console.log("UniswapV2Factory code hash: ", codeHash);

    let f2 = await UniswapV2Factory.deploy(owner.address);
    await f2.deployed();

    console.log("UniswapV2Factory address: ", f2.address);
    await writeAddr(f2.address, "UniswapV2Factory2", network.name);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });