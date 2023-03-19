import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.18",

  networks: {

    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: {
        mnemonic: process.env.MNEMONIC
      }
    },

    mumbai: {
      url: "https://endpoints.omniatech.io/v1/matic/mumbai/public",
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
