task("EnsContenthash", "Prints an account's balance").setAction(async (taskArgs, hre) => { 

    //const wnft_contract = await hre.deployments.get("WNFT");
    const {getNamedAccounts, deployments} = hre;  
    const {execute, read}  = deployments;
    const namedAccounts = await getNamedAccounts();
    const {deployer} = namedAccounts;


    
    const returned_value1 = await read("WNFT", {from: deployer, log: true}, "ENSNodeID");
    console.log('ens node id', returned_value1)

    const returned_value2 = await read("WNFT", {from: deployer, log: true}, "ensContenthash");
    console.log('contenthash', returned_value2)


});

module.exports = {};