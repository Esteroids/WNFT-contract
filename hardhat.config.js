/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("ethereum-waffle")
require("hardhat-contract-sizer")

const fs = require("fs")
const dotenv = require("dotenv")

const result = dotenv.config()

if (result.error) {
  throw result.error
}

try {
  const localEnv = ".env.local"
  if (fs.existsSync(localEnv)) {
    // file exists
    const envConfig = dotenv.parse(fs.readFileSync(localEnv))
    for (const k in envConfig) {
      process.env[k] = envConfig[k]
    }
  }
} catch (err) {
  console.error(err)
}

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key

// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts

const PRIVATE_KEY = process.env.PRIVATE_KEY

const RINKEBY_RPC_URL =
  process.env.RINKEBY_RPC_URL ||
  (process.env.ALCHEMY_RINKEBY_API_KEY && `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_RINKEBY_API_KEY}`) ||
  ""
const GOERLI_RPC_URL =
  process.env.GOERLI_RPC_URL ||
  (process.env.ALCHEMY_GOERLI_API_KEY && `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_GOERLI_API_KEY}`) ||
  ""
const KOVAN_RPC_URL =
  process.env.KOVAN_RPC_URL ||
  (process.env.ALCHEMY_KOVAN_API_KEY && `https://eth-kovan.alchemyapi.io/v2/${process.env.ALCHEMY_KOVAN_API_KEY}`) ||
  ""
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
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    kovan: {
      url: KOVAN_RPC_URL,
      accounts: [PRIVATE_KEY],
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
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
}
