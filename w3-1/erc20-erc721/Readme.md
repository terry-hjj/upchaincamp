# 部署到Goerli
```shell
$ npx hardhat run scripts/deploy.ts --network goerli
Terry20 deployed to  0x1d8e454eb44A5bC3c079a994EE996D34eC61340c
Terry721 deployed to  0x49cdfD8238c6cD31d3c0aB2f14f058DB4e86943A
Vault deployed to  0xae178b129a1A1B263C1e82C8883543b171C91d1c
NftExchange deployed to  0xD8Ea2A2e1D5B413f3d8350E0c43574a763284e9B

$ 
```

# hardhat console 执行操作
```
$ npx hardhat console --network goerli
> let provider = new ethers.providers.JsonRpcProvider("...");
> let abi20 = `...`;
> let abi721 = `...`;
> let abiVault = `...`;
> let abiExchange = `...`;
> let addr20 = "0x1d8e454eb44A5bC3c079a994EE996D34eC61340c";
> let addr721 = "0x49cdfD8238c6cD31d3c0aB2f14f058DB4e86943A";
> let addrVault = "0xae178b129a1A1B263C1e82C8883543b171C91d1c";
> let addrExchange = "0xD8Ea2A2e1D5B413f3d8350E0c43574a763284e9B";
> const terry20 = new ethers.Contract(addr20, abi20, provider);
> const terry721 = new ethers.Contract(addr721, abi721, provider);
> const vault = new ethers.Contract(addrVault, abiVault, provider);
> const exchange = new ethers.Contract(addrExchange, abiExchange, provider);
> const accs = await ethers.getSigners();

// 存取代币
// 0号用户给3号用户转 5000000000000000 代币最小单位
await (await terry20.connect(accs[0]).transfer(accs[3].address, 5000000000000000)).wait();
// 查询0号,3号各自代币数量
await terry20.balanceOf(accs[0].address); // BigNumber { value: "99999995000000000000000" }
await terry20.balanceOf(accs[3].address); // BigNumber { value: "5000000000000000" }
// 3号用户给4号用户存入 2000000000000000 代币最小单位 (通过vault.deposite函数)
await (await terry20.connect(accs[3]).approve(vault.address, 2000000000000000)).wait(); // 3号用户先给vault合约授权
await terry20.allowance(accs[3].address, vault.address); // 检查 3号用户授权给合约数量是否成功
await (await vault.connect(accs[3]).deposite(accs[4].address, 2000000000000000)).wait(); // deposit
// 查询3号,4号,vault合约各自代币数量
await terry20.balanceOf(accs[3].address); // BigNumber { value: "3000000000000000" }
await terry20.balanceOf(accs[4].address); // BigNumber { value: "0" }
await terry20.balanceOf(vault.address); // BigNumber { value: "2000000000000000" }
// 查询4号用户在vault中的存款数量
await vault.deposited(accs[4].address); // BigNumber { value: "2000000000000000" }
// 4号用户提取vault中存款 (通过vault.withdraw函数)
await (await vault.connect(accs[4]).withdraw(2000000000000000)).wait();
// 查询 4号用户在vault中的存款数量
await vault.deposited(accs[4].address); // BigNumber { value: "0" }
// 查询 4号用户的代币数量
await terry20.balanceOf(accs[4].address); // BigNumber { value: "2000000000000000" }


// 交易NFT
// 铸造一个NFT给 1号用户
> let tx = await terry721.connect(accs[0]).mint(accs[1].address, "ipfs://QmdM8dd4WeNnG2PhE4h2t2q2SsopBJmWXMTLXTMNrgBonV");
> await tx.wait();
// 铸造的第一个nft 的 tokenId 应该是0, 通过此id反查其owner, 确定他正是 1号用户
> await terry721.ownerOf(0);
'0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
> accs[1].address
'0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
// 1号用户先授权nftExchange合约可用他的 tokenId=0 nft
> tx = await terry721.connect(accs[1]).approve(exchange.address, 0);
> await tx.wait();
// 上架该nft
> tx = await exchange.connect(accs[1]).list(0, 2000000000000000);
> await tx.wait();
// 

// 2号用户先授权vault合约可用他的代币, 数量为 2000000000000000
> tx = await terry20.connect(accs[2]).approve(exchange.address, 2000000000000000);
> await tx.wait();
// 2号用户购买1号用户上架的nft (先给 2号用户转代币)
> tx = await terry20.connect(accs[0]).transfer(accs[2].address, 2000000000000000);
> await tx.wait()
> tx = await exchange.connect(accs[2]).buy(0, 2000000000000000);
> await tx.wait();
// 查看 tokenId = 0 的nft, 现在的owner是不是 2号用户
> await terry721.ownerOf(0);
'0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
> accs[2].address
'0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
// 查看 1号用户是否收到了代币
> await terry20.balanceOf(accs[1].address);
BigNumber { value: "2000000000000000" }
```