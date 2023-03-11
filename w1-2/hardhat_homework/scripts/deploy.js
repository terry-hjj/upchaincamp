const hre = require("hardhat");
require("hardhat-abi-exporter");
const { writeAbiAddr } = require("./artifact_saver");

const initValue = 2;

async function main() {
  const Counter = await hre.ethers.getContractFactory("Counter");
  const counter = await Counter.deploy(initValue);
  await counter.deployed();
  console.log(`Counter deployed to ${counter.address}`);

  const artifact = await hre.artifacts.readArtifact("Counter");
  await writeAbiAddr(artifact, counter.address, "Counter", network.name);

  console.log(`Please verify: npx hardhat verify ${counter.address}` );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
