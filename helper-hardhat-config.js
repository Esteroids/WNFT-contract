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
    ensPublicResolver: "0x4B1488B7a6B320d2D721406204aBc3eeAa9AD329",
  },
  80001: {
    name: "matic",
    ethUsdPriceFeed: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
    ensRegistry: "0x0000000000000000000000000000000000000000",
    ensPublicResolver: "0x0000000000000000000000000000000000000000",
  },
  137: {
    name: "matic",
    ethUsdPriceFeed: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
    ensRegistry: "0x0000000000000000000000000000000000000000",
    ensPublicResolver: "0x0000000000000000000000000000000000000000",
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

module.exports = {
  networkConfig,
  getNetworkIdFromName,
  developmentChains,
}
