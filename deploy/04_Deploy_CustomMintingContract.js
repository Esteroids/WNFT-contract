module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, execute } = deployments
  const { deployer } = await getNamedAccounts()

  const wnftContract = await deployments.get("WNFT")

  // Deployed simple minting contract that approves all
  log("----------------------------------------------------")
  await deploy("MintingLimitedAmount", {
    from: deployer,
    log: true,
  })
  log("Custom Minting deployed")
  log("----------------------------------------------------")

  
  
  await execute("MintingLimitedAmount", {from: deployer, log: true}, "increaseMaxAmount", 25);/*.then((tx) => tx.wait());*/
  await execute("MintingLimitedAmount", {from: deployer, log: true}, "setWNFT", wnftContract.address);/*.then((tx) => tx.wait());*/


}

module.exports.tags = ["minting"]
module.exports.id = "custom-minting"
