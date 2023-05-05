require("@nomiclabs/hardhat-waffle");


task("accounts", "Prints the list of accounts", async() => {
    const accounts = await ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

module.exports = {
    solidity: {
        compilers: [
          {
            version: "0.4.18",
            settings: {
              optimizer: {
                enabled: true,
                runs: 200
              }
            }
          },
          {
            version: "0.5.16",
            settings: {
              optimizer: {
                enabled: true,
                runs: 200
              }
            }
          },
          {
            version: "0.6.6",
            settings: {
              optimizer: {
                enabled: true,
                runs: 999999
              }
            }
          },
          {
            version: "0.6.12",
            settings: {
              optimizer: {
                enabled: true,
                runs: 5000
              }
            }
          }
        ],
      },
    networks: {
        dev: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
        }
    }
};