
import { ethers } from "hardhat";

async function main() {
    const Terry20 = await ethers.getContractFactory("Terry20");
    const Terry721 = await ethers.getContractFactory("Terry721");
    const Vault = await ethers.getContractFactory("Vault");
    const NftExchange = await ethers.getContractFactory("NftExchange");
    const terry20 = await Terry20.deploy();
    const terry721 = await Terry721.deploy();
    const vault = await Vault.deploy(terry20.address);
    const nftExchange = await NftExchange.deploy(terry20.address, terry721.address);
    await terry20.deployed();
    await terry721.deployed();
    await vault.deployed();
    await nftExchange.deployed();

    console.log("Terry20 deployed to ", terry20.address);
    console.log("Terry721 deployed to ", terry721.address);
    console.log("Vault deployed to ", vault.address);
    console.log("NftExchange deployed to ", nftExchange.address);
}

main().catch(error=>{
    console.error(error);
    process.exitCode = 1;
});