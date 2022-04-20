task("MintingInvitationSetup", "Prints an account's balance").setAction(async (taskArgs, hre) => { 

    //const wnft_contract = await hre.deployments.get("WNFT");
    const {getNamedAccounts, deployments} = hre;  
    const namedAccounts = await getNamedAccounts();
    const {deployer} = namedAccounts;
    const invitationTokenContract = await deployments.get("MintingInvitationBased")
    const wnftContract = await deployments.get("WNFT")

    const wnftDeployedContract = await hre.ethers.getContractAt('WNFT', wnftContract.address);

    const setMintingContractTx = await wnftDeployedContract.setMintingContract(invitationTokenContract.address);
    await setMintingContractTx.wait();

    console.log("Done - Setting invitation token")

});

module.exports = {};