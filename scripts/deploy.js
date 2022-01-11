const hre = require("hardhat")
const { networkConfig, getNetworkIdFromName } = require("../helper-hardhat-config")
const { copyAfterDeploy } = require("./../utils/deploy-hooks.js")

async function main(deployNetworkConfig) {
  const ensNodeId = "0x18b7e70c27aa3a4fd844e78c153b49a03233f5588351c1fc26cff3486469b379"

  ;["ensPublicResolver", "ensRegistry", "ethUsdPriceFeed"].forEach((networkAttr) => {
    !deployNetworkConfig[networkAttr] &&
      console.error(
        "Couldnt find",
        networkAttr,
        " for network:",
        deployNetworkConfig.name,
        " will deploy with empty ",
        networkAttr,
      )
  })

  const wnftName = "Citadel"
  const wnftSymbol = "CIT"

  const Minting = await hre.ethers.getContractFactory("Minting")
  const mintingContract = await Minting.deploy()
  console.log("Minting Contract deployed to:", mintingContract.address)

  const WNFT = await hre.ethers.getContractFactory("WNFT")
  const wnftContract = await WNFT.deploy(
    wnftName,
    wnftSymbol,
    mintingContract.address,
    hre.ethers.utils.getAddress(deployNetworkConfig.ensPublicResolver || "0x0000000000000000000000000000000000000000"),
    hre.ethers.utils.getAddress(deployNetworkConfig.ensRegistry || "0x0000000000000000000000000000000000000000"),
    ensNodeId,
    hre.ethers.utils.getAddress(deployNetworkConfig.ethUsdPriceFeed || "0x0000000000000000000000000000000000000000"),
  )

  await wnftContract.deployed()
  console.log("WNFT Contract deployed to:", wnftContract.address)

  const OnchainSize = await hre.ethers.getContractFactory("onchainTokenDataSize")
  const onchainSize = await OnchainSize.deploy(wnftContract.address)
  await onchainSize.deployed()
  console.log("onchain metadata size contract deployed to:", onchainSize.address)
}

getNetworkIdFromName(hre.network.name)
  .then((networkId) => {
    main(networkConfig[networkId])
      .then(() => {
        copyAfterDeploy()
        process.exitCode = 0
      })
      .catch((error) => {
        console.error(error)
        process.exitCode = 1
      })
  })
  .catch(() => {
    console.error("Couldnt find network ", hre.network.name, " config")
    process.exitCode = 1
  })
