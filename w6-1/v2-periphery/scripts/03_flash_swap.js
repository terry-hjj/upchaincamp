const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');
const delay = require('./delay.js');

let Factory = require(`../../v2-core/deployments/${network.name}/UniswapV2Factory.json`)
let Factory2 = require(`../../v2-core/deployments/${network.name}/UniswapV2Factory2.json`)
let FactoryABI = require(`../../v2-core/deployments/abi/UniswapV2Factory.json`)


let factoryAddr = Factory.address;
console.log("factoryAddr: ", factoryAddr);

let Router = require(`../deployments/${network.name}/Router.json`)
let routerAddr = Router.address;


let Router2 = require(`../deployments/${network.name}/Router_2.json`)
let router2Addr = Router2.address;


var atoken;
var btoken;
var router;
var owner;
var flashSwapContract;

console.log("Router address: ", routerAddr);


async function balances(tag, account) {
  let a2 =  await atoken.balanceOf(account);
  console.log(tag + "A 余额: " +  ethers.utils.formatUnits(a2, 18))

  let b2 = await btoken.balanceOf(account);
  console.log(tag + "B 余额: " +  ethers.utils.formatUnits(b2, 18))
}


async function deployToken() {
  const MyERC20 = await hre.ethers.getContractFactory("ERC20");
  let amount = ethers.utils.parseUnits("10000000", 18);
  atoken = await MyERC20.deploy(amount);
  await atoken.deployed();

  console.log("atoken:", atoken.address);

  btoken = await MyERC20.deploy(amount);
  await btoken.deployed();
  console.log("btoken:", btoken.address);
}

async function deployFlashSWap() {
  const FlashSwap = await hre.ethers.getContractFactory("FlashSwap");
  flashSwapContract = await FlashSwap.deploy(factoryAddr, router2Addr);
  await flashSwapContract.deployed();

  console.log("flashSwapContract:" + flashSwapContract.address)
}


async function addLiquidityOnPair1() {
  let UniswapRouter = await ethers.getContractFactory("UniswapV2Router02");
  router = await UniswapRouter.attach(routerAddr);

  await atoken.approve(router.address, ethers.constants.MaxUint256 );
  await btoken.approve(router.address, ethers.constants.MaxUint256 );

    // addLiquidity on pair1
    let atokenAmount  = ethers.utils.parseUnits("1000000", 18);
    let btokenAmount  = ethers.utils.parseUnits("2000000", 18);
    let tx = await router.addLiquidity(atoken.address, btoken.address, atokenAmount, btokenAmount,
        0, 0,
        owner.address, 16700718270);
    await tx.wait();


}

async function addLiquidityOnPair2() {

  await atoken.approve(router2Addr, ethers.constants.MaxUint256 );
  await btoken.approve(router2Addr, ethers.constants.MaxUint256 );

  let UniswapRouter = await ethers.getContractFactory("UniswapV2Router02");

    // addLiquidity on pair2
    router2 = await UniswapRouter.attach(router2Addr);
    let atokenAmount2  = ethers.utils.parseUnits("1500000", 18);
    let btokenAmount2 = ethers.utils.parseUnits("2000000", 18);
    let tx2 = await router2.addLiquidity(atoken.address, btoken.address, atokenAmount2, btokenAmount2,
        0, 0,
        owner.address, 16700718270);
    await tx2.wait();

  console.log("factory2 address: ", Factory2.address);
  let factory2 = new ethers.Contract(Factory2.address, 
    FactoryABI, owner);
  const pair2 = await factory2.getPair(atoken.address, btoken.address);
  console.log("pair2 address: ", pair2);
}


async function main() {
  [owner]  = await ethers.getSigners();
  await deployToken();

  await addLiquidityOnPair1();
  await addLiquidityOnPair2();


  await deployFlashSWap();

  let factory = new ethers.Contract(factoryAddr, 
    FactoryABI, owner);

  const pair = await factory.getPair(atoken.address, btoken.address);
  console.log("pair address: ", pair);
  
  await balances("before swap", owner.address);

  let tx = await flashSwapContract.flashSwap(pair, btoken.address);
  await tx.wait();

  await balances("after swap", owner.address);

  await balances("flashSwap Holder", flashSwapContract.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
