module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  // Deployed simple minting contract that approves all
  log("----------------------------------------------------")
  await deploy("Minting", {
    from: deployer,
    log: true,
  })
  log("Basic minting deployed")
  log("----------------------------------------------------")
}

module.exports.tags = ["all", "minting"]
module.exports.id = "basic-minting"
