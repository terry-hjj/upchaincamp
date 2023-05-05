const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');
const delay = require('./delay');

let Factory = require(`../../v2-core/deployments/${network.name}/UniswapV2Factory.json`)
let FactoryABI = require(`../../v2-core/deployments/abi/UniswapV2Factory.json`)


let factoryAddr = Factory.address;
console.log("factoryAddr: ", factoryAddr);

let Router = require(`../deployments/${network.name}/Router.json`)
let routerAddr = Router.address;

var atoken;
var btoken;
var router;
var oracle;
var owner;

console.log("Router address: ", routerAddr);

async function printShotPrice() {
  let amounts = await router.getAmountsOut(ethers.utils.parseUnits("1", 18), [atoken.address, btoken.address]);
  console.log("即时价格: 1 A = " +  ethers.utils.formatUnits(amounts[1], 18) + " B");
}

async function printTWAPPrice() {
  let amount = await oracle.consult(atoken.address, ethers.utils.parseUnits("1", 18));
  console.log("时间加权价格: 1 A = " +  ethers.utils.formatUnits(amount, 18) + " B");
}

async function balances(tag) {
  let a2 =  await atoken.balanceOf(owner.address);
  console.log(tag + "A 余额: " +  ethers.utils.formatUnits(a2, 18))

  let b2 = await btoken.balanceOf(owner.address);
  console.log(tag + "B 余额: " +  ethers.utils.formatUnits(b2, 18))
}

async function swap(path, amount) {
  let swapAmount = ethers.utils.parseUnits(amount, 18);
  await router.swapExactTokensForTokens(
    swapAmount, "0", 
    path, owner.address, 16700718270);
}

async function main() {
  [owner]  = await ethers.getSigners();

  const MyERC20 = await hre.ethers.getContractFactory("ERC20");
  let amount = ethers.utils.parseUnits("10000000", 18);
  atoken = await MyERC20.deploy(amount);
  await atoken.deployed();

  console.log("atoken:", atoken.address);

  btoken = await MyERC20.deploy(amount);
  await btoken.deployed();
  console.log("btoken:", btoken.address);

  let UniswapRouter = await ethers.getContractFactory("UniswapV2Router02");
  router = await UniswapRouter.attach(routerAddr);

  await atoken.approve(router.address, ethers.constants.MaxUint256 );
  await btoken.approve(router.address, ethers.constants.MaxUint256 );

  let liqAmount  = ethers.utils.parseUnits("1000000", 18);
  let liq2Amount = ethers.utils.parseUnits("2000000", 18);
  let tx = await router.addLiquidity(atoken.address, btoken.address, liqAmount, liq2Amount,
      0, 0,
      owner.address, 16700718270);
  await tx.wait();

  let OracleSimple = await ethers.getContractFactory("ExampleOracleSimple");
  oracle = await OracleSimple.deploy(factoryAddr, atoken.address, btoken.address);
  await oracle.deployed();

  let factory = new ethers.Contract(factoryAddr, 
    FactoryABI, owner);

  const pair = await factory.getPair(atoken.address, btoken.address);
  console.log("pair address: ", pair);

  
  await printShotPrice();
  await delay.advanceTime(ethers.provider, 600);
  await swap([atoken.address, btoken.address], "200000");
  await printShotPrice();

  await delay.advanceTime(ethers.provider, 600);
  await swap([btoken.address, atoken.address], "400000");
  await printShotPrice();

  await delay.advanceTime(ethers.provider, 1200);
  await swap([btoken.address, atoken.address], "200000");
  await printShotPrice();

  await delay.advanceTime(ethers.provider, 1200); // 60 * 60
  await oracle.update();
  await printTWAPPrice();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
