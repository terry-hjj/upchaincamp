import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';


const my2612 = require("./deployments/dev/My2612.json");
const vault = require("./deployments/dev/Vault.json");
const my2612Abi = require("./deployments/abi/My2612.json");
const vaultAbi = require("./deployments/abi/Vault.json");


function App() {
  const [hasInit, setHasInit] = useState(false)
  const [provider, setProvider] = useState({})
  const [ctx, setCtx] = useState({})

  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState(0)
  const refRecipient = useRef()
  const refAmount = useRef()

  const [stakeAmount, setStakeAmount] = useState(0)
  const refStakeAmount = useRef()
  



  const initProvider = async ()=>{
    if (typeof window.ethereum === 'undefined' || window.ethereum === null) {
      console.log("need metamask");
    } else {
      let p = new ethers.providers.Web3Provider(window.ethereum);
      console.log(p);
      setProvider(p);
      setHasInit(true);
      console.log(provider)  
    }
  }

  const initNetworkAccounts = async ()=>{
    console.log(provider);
    const network = await provider.getNetwork()
    console.log(network)
    const accounts = await provider.send("eth_requestAccounts", [])
    console.log("accounts: ", accounts)
    const account = accounts[0]
    const signer = provider.getSigner();
    console.log("signer: ", signer);
    const erc20Token = new ethers.Contract(my2612.address, my2612Abi, signer);
    const bank = new ethers.Contract(vault.address, vaultAbi, signer);
    console.log(erc20Token);
    console.log(bank);
    setCtx({...ctx, ...network, account, signer, erc20Token, bank })
  }

  const readContract = ()=>{
    let ethBalance;
    let name;
    let decimal;
    let symbol;
    let supply;
    let balance;
    let myDeposit;
    let approved;

    console.log(provider)
    console.log(ctx)

    provider.getBalance(ctx.account).then((r)=>{
      ethBalance = ethers.utils.formatUnits(r, 18);
      console.log(ethBalance);
      // setCtx({...ctx, ethBalance})
    });

    console.log(ctx.erc20Token);
    
    ctx.erc20Token.name().then((r)=>{
      name = r;
      console.log("name: ", name);
      // setCtx({...ctx, name})
    }).catch((e)=>{
      console.log(e)
    });

    ctx.erc20Token.decimals().then((r)=>{
      decimal = r;
      console.log(decimal)
      // setCtx({...ctx, decimal})
    });

    ctx.erc20Token.symbol().then((r)=>{
      symbol = r;
      console.log(symbol);
      // setCtx({...ctx, symbol})
    });

    ctx.erc20Token.totalSupply().then((r)=>{
      supply = ethers.utils.formatUnits(r, 18);
      console.log(supply);
      // setCtx({...ctx, supply})
    });

    ctx.erc20Token.balanceOf(ctx.account).then((r)=>{
      balance = ethers.utils.formatUnits(r, 18);
      console.log(balance);
      // setCtx({...ctx, balance})
    });

    ctx.bank.deposited(ctx.account).then((r)=>{
      myDeposit = ethers.utils.formatUnits(r, 18);
      console.log(myDeposit);
      // setCtx({...ctx, myDeposit})
    })

    ctx.erc20Token.allowance(ctx.account, vault.address).then((r)=>{
      approved = ethers.utils.formatUnits(r, 18);
      console.log(approved);
      // setCtx({...ctx, approved})
    })

    setTimeout(()=>{
      setCtx({...ctx, ethBalance, name, decimal, symbol, supply, balance, myDeposit, approved})
      console.log(ctx)
    }, 1000);
    
  }

  useEffect(()=>{
    if (hasInit === false) {
      console.log('have not init')
    } else if (typeof provider === 'undefined' || provider === null) {
    console.log("can't get network");
  } else {
    console.log(provider);
    initNetworkAccounts()
      .then(()=>{
        console.log("init ok")
      })
      .catch((e)=>console.log("init fail: ", e))
    console.log(ctx)
  }}, [hasInit])

  const transfer = ()=>{
    if (!ctx.erc20Token) {
      alert("need metamask");
      return
    }
    console.log(refRecipient.current.value);
    console.log(refAmount.current.value);
    const recipient = refRecipient.current.value;
    const amount = ethers.utils.parseUnits(refAmount.current.value, 18)
    ctx.erc20Token.transfer(recipient, amount).then((r)=>{
      console.log("transfer return")
      r.wait().then((result)=>{
        console.log("tx wait() done")
        readContract()
      }).catch((e)=>{
        console.log("tx wait() fail")
      })
    }).catch((e)=>{
      console.log("transfer error: ", e)
    })
  }

  const permitDeposit = ()=>{
    if (!ctx.erc20Token) {
      alert("need metamask");
      return
    }
    console.log(refStakeAmount.current.value)
    const stakeAmount = ethers.utils.parseUnits(refStakeAmount.current.value, 18)
    ctx.erc20Token.nonces(ctx.account).then((nonce)=>{
      let deadline = Math.ceil(Date.now()/1000) + parseInt(20 * 60)
      let amountStr = stakeAmount.toString()

      const domain = {
        name: 'ERC2612',
        version: '1',
        chainId: ctx.chainId,
        verifyingContract: my2612.address
      }
      const types = {
        Permit: [
          {name: "owner", type: "address"},
          {name: "spender", type: "address"},
          {name: "value", type: "uint256"},
          {name: "nonce", type: "uint256"},
          {name: "deadline", type: "uint256"}
        ]
      }
      const message = {
        owner: ctx.account,
        spender: vault.address,
        value: stakeAmount,
        nonce: nonce,
        deadline: deadline
      }
      ctx.signer._signTypedData(domain, types, message).then((signature)=>{
        console.log("signature: ", signature)
        const {v, r, s} = ethers.utils.splitSignature(signature)

        console.log("owner: ", ctx.account)
        console.log("signer: ", ctx.signer)
        console.log("v:", v)
        console.log("r:", r)
        console.log("s:", s)

        ctx.bank.permitDeposit(ctx.account, stakeAmount, deadline, v, r, s).then((tx)=>{
          tx.wait().then((resp)=>{
            console.log('permitDeposit tx wait() done')
            readContract()
          }).catch(e=>{
            console.log("permitDeposit tx wait() fail")
          })
        }).catch(e=>{
          console.log('permitDeposit tx fail')
        })

      }).catch(e=>{
        console.log("get signature error: ", e)
      })
    }).catch(e=>{
      console.log("get nonce error: ", e)
    })
  }

  return (
    <div className="App">
      App
      <ul>
        <li>{"chainId: " + ctx.chainId}</li>
        <li>{"account: " + ctx.account}</li>
        <li>{"name: " + ctx.name}</li>
        <li>{"symbol: " + ctx.symbol}</li>
        <li>{"decimal: " + ctx.decimal}</li>
        <li>{"supply: " + ctx.supply}</li>
        <li>{"balance: " + ctx.balance}</li>
        <li>{"ethBalance: " + ctx.ethBalance}</li>
        <li>{"----"}</li>
        <li>{"myDeposit: " + ctx.myDeposit}</li>
        <li>{"approved: " + ctx.approved}</li>
        
      </ul>
      <button onClick={()=>{initProvider()}}>initProvider</button>
      <button onClick={()=>{readContract()}}>readContract</button>
      <hr/>
      <h3>普通转账:</h3>
      <div >
        转账到:
        <input type="text" ref={refRecipient} />
        <br />转账金额
        <input type="text" ref={refAmount}/>
        <br />
        <button onClick={transfer}> 转账 </button>
      </div>
      <hr/>
      <h3>离线授权存款</h3>
      <div>
        金额<input type="text" ref={refStakeAmount} />
        <br/>
        <button onClick={permitDeposit}> 离线授权存款 </button>
      </div>
      
    </div>
  );
}

export default App;
