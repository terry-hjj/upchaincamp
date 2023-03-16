Readme.md

Bank合约部署到 goerli测试网的合约地址:

0x3a1e21cE80d033aA741941FD127a9DD73B43a36D




metamask 一账号向该合约转账 0.005 的交易hash:

0x9d95737b8967791beadff9bb92703b528f592dfcee0fc1ff1e313c975812dd81




metamask 另一账号向该合约转账 0.003 的交易hash:

0x2a57e8c023999690c70e636fe72ca1a08a100abbc974e76b57577ba127d1ea4c




通过ethers 以owner身份调用合约的withdrawAll函数, 取得合约内所有金额的交易hash:

0xbfc9b964c5f1688d2e2d9e3cfa4db415d48d90d8814195f9fa9661b536d83249 





```
$ npx hardhat console --network goerli
Welcome to Node.js v16.17.1.
Type ".help" for more information.
> let provider = ethers.getDefaultProvider('goerli');
undefined
> const ContractAbi = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"stateMutability":"payable","type":"fallback"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"myBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]';
undefined
> const ContractAddr = '0x3a1e21cE80d033aA741941FD127a9DD73B43a36D';
undefined
> const bank = new ethers.Contract(ContractAddr, ContractAbi, provider);
undefined
> const accounts = await ethers.getSigners();
undefined
> let balanceAll = await provider.getBalance(ContractAddr);
undefined
> ethers.utils.formatEther(balanceAll);
'0.008'
> let b0 = await bank.connect(accounts[0]).myBalance();
undefined
> ethers.utils.formatEther(b0);
'0.005'
> let b1 = await bank.connect(accounts[1]).myBalance();
undefined
> ethers.utils.formatEther(b1);
'0.003' 
> await bank.connect(accounts[0]).withdrawAll();
{
  hash: '0xbfc9b964c5f1688d2e2d9e3cfa4db415d48d90d8814195f9fa9661b536d83249',
  type: 2,
  accessList: [],
  blockHash: null,
  blockNumber: null,
  transactionIndex: null,
  confirmations: 0,
  from: '0x32c29921649fD258532D92282De516d55a776d10',
  gasPrice: BigNumber { value: "74950725236" },
  maxPriorityFeePerGas: BigNumber { value: "1500000000" },
  maxFeePerGas: BigNumber { value: "74950725236" },
  gasLimit: BigNumber { value: "32968" },
  to: '0x3a1e21cE80d033aA741941FD127a9DD73B43a36D',
  value: BigNumber { value: "0" },
  nonce: 13,
  data: '0x853828b6',
  r: '0x46f9245dc14cb5c89a18e87ac1c3cc1ce6b683c417967cbe94417ab17a390601',
  s: '0x610cda66f606c3c68db6ecbbd722e4a177dd840abda5fef3c8b78c94c586c040',
  v: 0,
  creates: null,
  chainId: 5,
  wait: [Function (anonymous)]
}
> balanceAll = await provider.getBalance(ContractAddr);
BigNumber { value: "0" }
> ethers.utils.formatEther(balanceAll);
'0.0'
```
