import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

describe("deposite, then check balance", async ()=>{
    let provider: any;
    let bank: Contract;

    beforeEach(async ()=>{
        const Bank = await ethers.getContractFactory("Bank");
        bank = await Bank.deploy();
        await bank.deployed();
        provider = new ethers.providers.JsonRpcProvider(process.env.localhost);
    });

    it("转账前合约金额为0, 转账后合约记录各账户的转账金额, 且合约金额为转账总和", async ()=>{
        const [acc0, acc1] = await ethers.getSigners();
        const value = ethers.utils.parseEther("0.001");
        const to = bank.address;
        let balance;

        // 合约自身的初始金额为0
        balance = await provider.getBalance(bank.address);
        expect(balance).equal(ethers.utils.parseEther("0"));

        // 转账到合约后, 查询自己在合约中记录的余额, 与自己转入的金额相等
        balance = await bank.connect(acc0).myBalance();
        expect(balance).equal(ethers.utils.parseEther("0")); // 转账前记录自己的balance为0
        await acc0.sendTransaction({ to, value }); // 转账
        balance = await bank.connect(acc0).myBalance();
        expect(balance).equal(value);

        // 测试另一个人转账
        balance = await bank.connect(acc1).myBalance();
        expect(balance).equal(ethers.utils.parseEther("0")); // 转账前记录自己的balance为0
        await acc1.sendTransaction({ to, value }); // 转账
        balance = await bank.connect(acc1).myBalance();
        expect(balance).equal(value);

        // 查询合约自身的余额, 与用户转给它的金额之和相等
        balance = await provider.getBalance(bank.address);
        console.log(balance);
        expect(balance).equal(ethers.utils.parseEther("0.002"));
    });

    it("一个人转账后, 查询自己的存款, 再取出", async ()=>{
        const [acc0, acc1] = await ethers.getSigners();
        const value  = ethers.utils.parseEther("0.001");
        const to = bank.address;
        let balance;

        await acc0.sendTransaction({ to, value }); // 转账
        await acc0.sendTransaction({ to, value }); // 转账
        await acc0.sendTransaction({ to, value }); // 再转账
        
        // 查询自己的存款
        balance = await bank.connect(acc0).myBalance();
        expect(balance).equal(ethers.utils.parseEther("0.003")); // 存款为之前转账之和

        // 试图取出款项超过了当前存款, 失败
        expect(await bank.connect(acc0).myBalance()).equal(ethers.utils.parseEther("0.003"));
        expect(bank.connect(acc0)['withdraw'](3000000000000001, {gasLimit: 100000})).revertedWith("not enough balance.");
        expect(await bank.connect(acc0).myBalance()).equal(ethers.utils.parseEther("0.003"));

        // 取出部分款项, 剩余存款为原有存款减去取出的存款
        await bank.connect(acc0).withdraw(1000000000000000);
        expect(await bank.connect(acc0).myBalance()).equal(ethers.utils.parseEther("0.002"));

        // 试图取出款项刚好等于余额, 成功, 取出后, 验证余额为0
        await bank.connect(acc0).withdraw(2000000000000000);
        expect(await bank.connect(acc0).myBalance()).equal(ethers.utils.parseEther("0"));
    });

    it("非owner不能取走合约内所有余额, owner可以", async()=>{
        const [acc0, acc1] = await ethers.getSigners();
        const value  = ethers.utils.parseEther("0.001");
        const to = bank.address;
        let balance;

        await acc0.sendTransaction({ to, value }); // 转账
        await acc0.sendTransaction({ to, value }); // 转账
        await acc0.sendTransaction({ to, value }); // 再转账

        // 非owner试图取走合约所有余额, 失败
        expect(bank.connect(acc1).withdrawAll()).revertedWith("you cannot withdrawAll.");

        // owner取走合约所有余额, 成功, 取完后,合约内的余额为0
        expect(await provider.getBalance(bank.address)).equal(ethers.utils.parseEther("0.003"));
        await bank.connect(acc0).withdrawAll();
        expect(await provider.getBalance(bank.address)).equal(ethers.utils.parseEther("0"));
    });
});