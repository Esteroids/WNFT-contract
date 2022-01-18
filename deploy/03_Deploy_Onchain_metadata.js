module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const wnftContract = await deployments.get("WNFT")
  const wnftContractAddress = wnftContract.address

  log("----------------------------------------------------")
  await deploy("onchainTokenDataSize", {
    from: deployer,
    args: [wnftContractAddress],
    log: true,
  })

  await deploy("onchainTokenDataString", {
    from: deployer,
    args: [wnftContractAddress],
    log: true,
  })

  await deploy("onchainTokenDataUint", {
    from: deployer,
    args: [wnftContractAddress],
    log: true,
  })
  log("----------------------------------------------------")
}

module.exports.tags = ["all", "onchainTokenData"]
module.exports.id = "onchainTokenData"
