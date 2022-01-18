const { networkConfig } = require("../helper-hardhat-config")
const { ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const DECIMALS = 8
  const INITIAL_PRICE = ethers.BigNumber.from(140330173736)

  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = await getChainId()

  const networkName = networkConfig[chainId].name

  if (networkConfig[chainId].ethUsdPriceFeed === undefined) {
    log("Network", networkName, "doesnt have ethUsdPriceFeed deploying mock")
    await deploy("MockV3Aggregator", {
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    })
    log("----------------------------------------------------")
    log("Mocks Deployed!")
    log("----------------------------------------------------")
  }
}
module.exports.tags = ["all", "mocks", "main"]
module.exports.id = "mocks"
