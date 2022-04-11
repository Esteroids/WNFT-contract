task("CollectionMetadataFields", "Prints an account's balance").setAction(async (taskArgs, hre) => { 

    //const wnft_contract = await hre.deployments.get("WNFT");
    const {getNamedAccounts, deployments} = hre;  
    const {execute, read}  = deployments;
    const namedAccounts = await getNamedAccounts();
    const {deployer} = namedAccounts;
    //console.log(accountAddress)
    const my_field = "my field 1"
    //await execute("WNFT", {from: deployer, log: true}, "addCollectionOnchainMetadataField", my_field);

    const my_value = "value from 23/2/2022"
    await execute("WNFT", {from: deployer, log: true}, "setCollectionOnchainMetadata", my_field, my_value);


    const returned_value = await read("WNFT", {from: deployer, log: true}, "collectionOnchainMetadata", my_field);

    let my_log_func = console.log
    if (returned_value!=my_value){
        my_log_func = console.error
    }

    my_log_func('CollectionMetadataFields field:', my_field, 'expected value is:', my_value,'returned value is:', returned_value)
    

});

module.exports = {};