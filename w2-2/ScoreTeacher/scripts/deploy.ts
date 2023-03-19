import { ethers } from "hardhat";

async function main() {
  const [acc0, acc1] = await ethers.getSigners();

  const Score = await ethers.getContractFactory("Score");
  const score = await Score.connect(acc0).deploy(); // 使用第一个账号部署score
  await score.deployed();
  console.log(`Score deployed to ${score.address}`);

  const Teacher = await ethers.getContractFactory("Teacher");
  const teacher = await Teacher.connect(acc1).deploy(score.address);  // 使用第二个账号部署teacher, 要用到已部署的score合约的地址
  await teacher.deployed();
  console.log(`Teacher deployed to ${teacher.address}`);
}

main().catch(error=>{
  console.error(error);
  process.exitCode = 1;
});