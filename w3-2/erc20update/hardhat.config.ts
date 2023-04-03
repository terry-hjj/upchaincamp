import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {

    goerli: {
      url: process.env.GOERLI_RPC_URL,
      // url: "https://goerli.blockpi.network/v1/rpc/public",
      timeout: 600000,
      gasPrice: 20000000,
      gas: 400000,
      accounts: {
        mnemonic: process.env.MNEMONIC
      }
    },

    mumbai: {
      // url: "https://endpoints.omniatech.io/v1/matic/mumbai/public",
      url: "https://polygon-mumbai.blockpi.network/v1/rpc/public",
      timeout: 240000,
      gasPrice: 100000000000,
      gas: 400000,
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
      chainId: 80001,
    },
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
    // apiKey: process.env.POLYGON_API_KEY
  },
};

export default config;
