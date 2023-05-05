require("@nomiclabs/hardhat-waffle");
require('hardhat-abi-exporter');

task("accounts", "Prints the list of accounts", async() => {
    const accounts = await ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

module.exports = {
    solidity: "0.5.16",
    // solidity: {
    //     version: "0.5.16",
    //     settings: {
    //         optimizer: {
    //             enabled: true,
    //             runs: 200
    //         }
    //     }
    // },

    abiExporter: {
        path: './deployments/abi',
        clear: true,
        flat: true,
        only: [],
        spacing: 2,
        pretty: true,
    },

    networks: {
        dev: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
        }
    }
};