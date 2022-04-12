module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const contractInviteTokenName = 'Citadef Invitation Token'
    const contractInviteTokenSymbol = 'INCTD'
  
    // Deployed simple minting contract that approves all
    log("----------------------------------------------------")

    await deploy("InviteToken", {
      from: deployer,
      log: true,
      args: [
        contractInviteTokenName,
        contractInviteTokenSymbol,
        1000,
      ],
    })
    log("InviteToken deployed")
    log("----------------------------------------------------")
  }
  
  module.exports.tags = ["all", "invite-tokens", ]
  module.exports.id = "citadef-invite-token"