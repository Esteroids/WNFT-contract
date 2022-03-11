task("MintSample", "Prints an account's balance").setAction(async (taskArgs, hre) => { 

    //const wnft_contract = await hre.deployments.get("WNFT");
    const {getNamedAccounts, deployments} = hre;  
    const {execute, read}  = deployments;
    const namedAccounts = await getNamedAccounts();
    const {deployer} = namedAccounts;
    //console.log(accountAddress)
    //const tokenOwner = hre.ethers.utils.getAddress("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");

    const price = hre.ethers.BigNumber.from(140330173736)
    const priceInETH = (50 * 10 ** 8) / price
    const priceInWie = hre.ethers.BigNumber.from((priceInETH * 10 ** 18).toString())

    const testTokenId = 1235
    await execute("WNFT", {from: deployer, log: true, value: priceInWie}, "mint", deployer, testTokenId)/*.then((tx) => tx.wait());;*/


    const testTokenId2 = 1236
    const tokenURI = 'ipnfs://k51qzi5uqu5dj0y17ybl22uf9anwhgxke9hqyswnunrvkupqphzzq8wog34yc2'
    await execute("WNFT", {from: deployer, log: true, value: priceInWie}, "mintWithTokenURI", deployer, testTokenId2, tokenURI)/*.then((tx) => tx.wait());*/


    const returned_value = await read("WNFT", {from: deployer, log: true}, "ownerOf", testTokenId);

    /*let my_log_func = console.log
    if (returned_value!=deployer){
        my_log_func = console.error
    }

    my_log_func('Mint token id:', testTokenId, 'tokenOwner: ', returned_value)*/
    

});

module.exports = {};