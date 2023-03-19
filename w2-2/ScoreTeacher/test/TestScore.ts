import { ethers } from "hardhat";
import { Contract } from "ethers";
import { expect } from "chai";
import "dotenv/config";


describe("score", async()=>{
  let score: Contract;
  let teacher: Contract;
  let provider;

  beforeEach(async()=>{
    const [acc0, acc1] = await ethers.getSigners();
    const Score = await ethers.getContractFactory("Score");
    score = await Score.connect(acc0).deploy(); // 使用第一个账号部署score
    await score.deployed();
    const Teacher = await ethers.getContractFactory("Teacher");
    teacher = await Teacher.connect(acc1).deploy(score.address); // 使用第二个账号部署teacher
    await teacher.deployed();
    provider = new ethers.providers.JsonRpcProvider(process.env.localhoste);
  })
  

  it("不是score的owner,不能设置老师, 只有owner才可以设置老师", async()=>{
    const [acc0, acc1, acc2] = await ethers.getSigners();
    // 非owner, 都报错
    await expect(score.connect(acc1).setTeacher(teacher.address)).revertedWithCustomError(score, "NotOwner");
    await expect(score.connect(acc2).setTeacher(teacher.address)).revertedWithCustomError(score, "NotOwner");
    // owner可以正常设置
    await score.connect(acc0).setTeacher(teacher.address);
    expect(await score.teacher()).equal(teacher.address);
  })

  it("不是teacher合约发起就不能设置学生分数", async()=>{
    const [acc0, acc1, acc2] = await ethers.getSigners();
    // score的owner直接调用score的setScore, 失败
    await expect(score.connect(acc0).setScore(acc2.address, 60)).revertedWithCustomError(score, "NotTeacher");
    // teacher的owner直接调用score的setScore, 失败
    await expect(score.connect(acc1).setScore(acc2.address, 60)).revertedWithCustomError(score, "NotTeacher");
    // 学生自己来调用score合约的setScore, 失败
    await expect(score.connect(acc2).setScore(acc2.address, 60)).revertedWithCustomError(score, "NotTeacher");
  })

  it("查看学生的分数", async()=>{
    const [acc0, acc1, acc2] = await ethers.getSigners();
    await score.connect(acc0).setTeacher(teacher.address);
    
    await (teacher.connect(acc1).setScore(acc2.address, 60));
    expect(await score.connect(acc0).getScore(acc2.address)).equal(60);
    expect(await score.connect(acc1).getScore(acc2.address)).equal(60);
    expect(await score.connect(acc2).getScore(acc2.address)).equal(60);
  })
})


describe("teacher", async()=>{
  let score: Contract;
  let teacher: Contract;
  let provider;

  beforeEach(async()=>{
    const [acc0, acc1] = await ethers.getSigners();
    const Score = await ethers.getContractFactory("Score");
    score = await Score.connect(acc0).deploy(); // 使用第一个账号部署score
    await score.deployed();
    const Teacher = await ethers.getContractFactory("Teacher");
    teacher = await Teacher.connect(acc1).deploy(score.address); // 使用第二个账号部署teacher
    await teacher.deployed();
    provider = new ethers.providers.JsonRpcProvider(process.env.localhoste);
  })

  it("只有teacher合约的创建者才能调用setScore函数修改分数", async()=>{
    const [acc0, acc1, acc2] = await ethers.getSigners();
    await score.connect(acc0).setTeacher(teacher.address);

    // 非teacher合约创建者,调用setScore失败
    await expect(teacher.connect(acc0).setScore(acc2.address, 60)).revertedWithCustomError(teacher, "NotSelf");
    await expect(teacher.connect(acc2).setScore(acc2.address, 60)).revertedWithCustomError(teacher, "NotSelf");
    // teacher合约创建者, 调用setScore成功
    await (teacher.connect(acc1).setScore(acc2.address, 60));
    expect(await score.connect(acc2).getScore(acc2.address)).equal(60);
  })

  it("修改的分数超过100分,则修改失败,分数仍保持原数值", async()=>{
    const [acc0, acc1, acc2] = await ethers.getSigners();
    await score.connect(acc0).setTeacher(teacher.address);

    // 修改小于100, 成功
    await teacher.connect(acc1).setScore(acc2.address, 99);
    expect(await score.connect(acc2).getScore(acc2.address)).equal(99);

    // 超过100,失败
    await expect(teacher.connect(acc1).setScore(acc2.address, 101)).revertedWithCustomError(teacher, "Above100");
    expect(await score.connect(acc2).getScore(acc2.address)).equal(99); // 分数保持原值

    // 修改等于100, 修改成功
    await teacher.connect(acc1).setScore(acc2.address, 100);
    expect(await score.connect(acc2).getScore(acc2.address)).equal(100);

    // 修改为0, 成功
    await teacher.connect(acc1).setScore(acc2.address, 0);
    expect(await score.connect(acc2).getScore(acc2.address)).equal(0);

  })
})