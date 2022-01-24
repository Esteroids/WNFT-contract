/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("ethereum-waffle")
require("hardhat-contract-sizer")

const { getRpcUrl, getAccounts } = require("./utils/networks")

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // // If you want to do some forking, uncomment this
      // forking: {
      //   url: MAINNET_RPC_URL
      // },
    },
    localhost: {},
    rinkeby: {
      url: getRpcUrl("rinkeby"),
      accounts: getAccounts("rinkeby"),
      saveDeployments: true,
    },
    goerli: {
      url: getRpcUrl("goerli"),
      accounts: getAccounts("goerli"),
      saveDeployments: true,
    },
    kovan: {
      url: getRpcUrl("kovan"),
      accounts: getAccounts("kovan"),
      saveDeployments: true,
    },
  },
  // hardhat-deploy
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.6.6",
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
        },
      },
    ],
  },
  sources: "./contracts",
  artifacts: "./artifacts",
  cache: "./cache",
  contractSizer: {},
  // hardhat-etherscan
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
}
