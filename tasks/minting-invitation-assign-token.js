task("MintingInvitationSetup", "Prints an account's balance").setAction(async (taskArgs, hre) => { 

    //const wnft_contract = await hre.deployments.get("WNFT");
    const {getNamedAccounts, deployments} = hre;  
    const {execute, read}  = deployments;
    const namedAccounts = await getNamedAccounts();
    const {deployer} = namedAccounts;

    const invitationTokenContract = await deployments.get("MintingInvitationBased")

    const setMintingContractTx = await execute("WNFT", {from: deployer, log: true}, "setMintingContract", invitationTokenContract.address);
    await setMintingContractTx.wait();

    console.log("Done - Setting invitation token")

});

module.exports = {};