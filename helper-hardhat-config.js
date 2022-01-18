const fs = require("fs")
const dotenv = require("dotenv")

const networkConfig = {
  default: {
    name: "hardhat",
    ensRegistry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    ensPublicResolver: "0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41",
  },
  31337: {
    name: "localhost",
    ensRegistry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    ensPublicResolver: "0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41",
  },
  42: {
    name: "kovan",
    ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
  },
  4: {
    name: "rinkeby",
    ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    ensRegistry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    ensPublicResolver: "0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41",
  },
  1: {
    name: "mainnet",
    ensRegistry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    ensPublicResolver: "0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41",
  },
  5: {
    name: "goerli",
    ensRegistry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    ensPublicResolver: "0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41",
  },
  80001: {
    name: "mumbai",
    ethUsdPriceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
  },
  137: {
    name: "polygon",
    ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
  },
}

const developmentChains = ["hardhat", "localhost"]

const getNetworkIdFromName = async (networkIdName) => {
  for (const id in networkConfig) {
    if (networkConfig[id].name === networkIdName) {
      return id
    }
  }
  return null
}

const loadEnvLocal = () => {
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
}

module.exports = {
  networkConfig,
  getNetworkIdFromName,
  developmentChains,
  loadEnvLocal,
}
