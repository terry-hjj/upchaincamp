require("@nomicfoundation/hardhat-toolbox");
require("hardhat-abi-exporter");

const dotenv = require("dotenv");
dotenv.config({path: "./.env"});


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",

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

  abiExporter: {
    path: './deployments/abi',
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: true,
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
    // apiKey: process.env.POLYGON_API_KEY
},
};
