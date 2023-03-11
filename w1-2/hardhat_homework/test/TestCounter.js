const { expect } = require("chai");

describe("Counter Test", async function(){

  let aAccount, bAccount;
  let counter;

  async function init() {
    [aAccount, bAccount] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy(2);
    await counter.deployed();
    console.log("Counter address: ", counter.address);
  }

  beforeEach(async ()=>{
    await init();
  });

  // case1: 部署者成功调用count()
  it("<owner> count() success", async ()=>{
    expect(await counter.counter()).to.equal(2);

    let ok_result = counter.count()
      .then(()=>"count() ok")
      .catch(()=>"count() fail");
    expect(await ok_result).to.equal("count() ok"); // 判断promise成功
    expect(await counter.counter()).to.equal(3);
    await counter.count();
    expect(await counter.counter()).to.equal(4);
    await counter.count();
    expect(await counter.counter()).to.equal(5); // counter递增
  });

  // case2: 其它地址调用count() 失败
  it("<other addr> count() fail", async ()=>{
    expect(await counter.counter()).to.equal(2);

    let fail_result = counter.connect(bAccount).count() // 其它地址调用
      .then(()=>"count() ok")
      .catch(()=>"count() fail");
    expect(await fail_result).to.equal("count() fail"); // 判断promise失败
    expect(await counter.counter()).to.equal(2); // counter仍保持初始值
    
  })
})