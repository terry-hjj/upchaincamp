// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

interface IScore {  // 修改分数的接口
  function setScore(address student, uint score) external;
}

contract Score {
  address public owner;
  address public teacher;
  mapping(address=>uint) student_scores;

  constructor() {
    owner = msg.sender;
  }

  error NotOwner();
  modifier onlyOwner {
    // require (msg.sender == owner, "you are not owner");
    if (msg.sender != owner) {
      revert NotOwner();
    }
    _;
  }
  // 只有管理员owner才能设置可以修改分数的teacher合约的地址, 该地址是在部署Teacher合约时得到的
  function setTeacher(address teacherAddr) external onlyOwner {
    teacher = teacherAddr;
  }

  error NotTeacher();
  modifier onlyTeacher{
    if (msg.sender != teacher) {
      revert NotTeacher();
    }
    _;
  }
  // 只有teacher合约才能修改学生分数
  function setScore(address student, uint score) external onlyTeacher{
    student_scores[student] = score;
  }

  // 查看该学生的分数
  function getScore(address student) view public returns(uint){
    return student_scores[student];
  }
  
}

contract Teacher {
  address public teacher_self;
  IScore scoreContract;

  constructor(address scoreContractAddr) {
    teacher_self = msg.sender;
    scoreContract = IScore(scoreContractAddr);
    // console.log("teacher init, score addr:", scoreContractAddr);
  }

  error Above100(); // 超过100分错误
  
  error NotSelf();
  modifier onlySelf{
    if (msg.sender != teacher_self) {
      revert NotSelf();
    }
    _;
  }
  // 只有老师自己才能改分数
  function setScore(address student, uint score) external onlySelf {
    if (score > 100) {
      revert Above100();
    }
    scoreContract.setScore(student, score);
  }
  
}