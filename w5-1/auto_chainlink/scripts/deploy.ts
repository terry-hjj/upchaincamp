import { ethers } from "hardhat";

async function main() {
  // const Terry20 = await ethers.getContractFactory("Terry20");
  // const terry20 = await Terry20.deploy();
  // await terry20.deployed();
  // console.log(`Terry20 deployed to ${terry20.address}`);

  // const Vault = await ethers.getContractFactory("Vault");
  // // const vault = await Vault.deploy(terry20.address); // Terry20 token address
  // const vault = await Vault.deploy("0x1d8e454eb44A5bC3c079a994EE996D34eC61340c"); // Terry20 token address in Goerli
  // await vault.deployed();
  // console.log(`Vault deployed to ${vault.address}`);

  const UpKeep = await ethers.getContractFactory("UpKeep");
  // const upKeep = await UpKeep.deploy(terry20.address, vault.address);
  const upKeep = await UpKeep.deploy("0x1d8e454eb44A5bC3c079a994EE996D34eC61340c", "0xEEC0BA242a881D5FcaF67D5d3221aF508da1C98c"); // Terry20 token address in Goerli
  await upKeep.deployed();
  console.log(`UpKeep deployed to ${upKeep.address}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// in hardhat node (localhost)
// Terry20 deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
// Vault deployed to 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
// UpKeep deployed to 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

// in goerli
// Terry20 deployed to 0x1d8e454eb44A5bC3c079a994EE996D34eC61340c
// Vault deployed to 0xEEC0BA242a881D5FcaF67D5d3221aF508da1C98c
// UpKeep deployed to 0x4E4dd47a559449D85EFB4Ae1221CF5da3d3f087C