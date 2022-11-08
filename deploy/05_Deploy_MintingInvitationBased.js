module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
  
    // Deployed simple minting contract that approves all
    log("----------------------------------------------------")

    const contractInviteToken = await deployments.get("InviteToken")
    const contractInviteTokenAddress = contractInviteToken.address

    await deploy("MintingInvitationBased", {
      from: deployer,
      log: true,
      args: [
        contractInviteTokenAddress,
      ],
    })
    log("MintingInvitationBased deployed")
    log("----------------------------------------------------")
  }
  
  module.exports.tags = ["all", "minting", ]
  module.exports.id = "minting-invitation-based"
  