const { networkConfig } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = await getChainId()

  const WNFTName = "Citadel"
  const WNFTSymbol = "CIT"
  const ensNodeId = "0x18b7e70c27aa3a4fd844e78c153b49a03233f5588351c1fc26cff3486469b379"

  let ethUsdPriceFeedAddress
  if (chainId === 31337 || networkConfig[chainId].ethUsdPriceFeed === undefined) {
    const mockFeedPrice = await deployments.get("MockV3Aggregator")
    ethUsdPriceFeedAddress = mockFeedPrice.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed
  }

  const minting = await deployments.get("Minting")
  const mintingAddress = minting.address

  const ensRegistryAddress = networkConfig[chainId].ensRegistry
  const ensPublicResolverAddress = networkConfig[chainId].ensPublicResolver

  log("----------------------------------------------------")
  await deploy("WNFT", {
    from: deployer,
    args: [
      WNFTName,
      WNFTSymbol,
      mintingAddress,
      ensPublicResolverAddress,
      ensRegistryAddress,
      ensNodeId,
      ethUsdPriceFeedAddress,
    ],
    log: true,
  })
  log("Deployed WNFT")
  log("----------------------------------------------------")
  log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  log("Please run `npx hardhat console` to interact with the deployed smart contracts!")
  log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
}

module.exports.tags = ["all", "wnft"]
