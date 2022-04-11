// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@ensdomains/ens/contracts/ENS.sol";
import "@ensdomains/resolver/contracts/Resolver.sol";

import "./minting/IMinting.sol";
import "./onchainData/IonchainTokensData.sol";

/*
* @title WNFT website Non-Fungible Token Standard basic implementation
* @dev WNFT basic implementation
*/
contract WNFT is Ownable, ERC721URIStorage {

    struct SC {
        address SCaddress;
        bytes4 SCinterface;
    }

    Resolver private _ensResolver;
    ENS private _ens;

    // ens node
    bytes32 private _ensNodeID;

    AggregatorV3Interface private _priceFeed;

    uint256 public wnftPriceInUSDPOW8 = 1*(10**8);

    // for iterating all tokens
    uint[] private _keys;
    uint public amount = 0;

    // address(0) if this contract is still maintained, otherwise it means the owners recommend user to switch
    // to a new contract
    address private _contractSwitched;

    // address of a contract that says if minting is allowed or not
    IMinting private _mintingContract;

    // mapping of onchain metadata fields for the whole WNFT collection.
    mapping(string=>string) private _collectionOnchainMetadata;

    // mapping of allowed fields in collection
    mapping(string => bool) private _collectionMetadataFields;

    // array of possilbe field names of token metadata
    string[] private _collectionMetadataFieldNames;
    uint public collectionMetadataFieldNamesCount = 0;

    // mapping of allowed fields in token
    mapping(string => SC) private _tokensMetadataFields;

    // array of possilbe field names of token metadata
    string[] private _tokensMetadataFieldNames;
    uint public tokensMetadataFieldNamesCount = 0;

    mapping(bytes4 => bool) private _onchainMetadataInterface;

    // true if the field (string) is set for the  WNFT token id (uint256) 
    // mapping(uint256 => mapping(string=>bool)) private _tokens_onchain_metadata;

    // URI for metadata for the whole WNFT collection
    // offchain per collection info
    string private _wnftUri;

    // emitted when WNFT contract owners add a new field of metadata for tokens
    // when new field is allowed and defined for all tokens 
    event TokenOnchainMetadataFieldAdded(string field, SC fieldSc);

    // emitted when WNFT contract owners add a new field of onchain metadata field for the WNFT collection
    // when new field of meta data allowed/defined for the collection
    event CollectionOnchainMetadataFieldAdded(string field);

    // emitted when owner switches from this contract to another
    event ContractSwitch(address newContract);

        // check if the onchain field interface equals a given interface.
    // If not it implies that either token field is undefined or the interface of the field
    // doesn't equal the interface of the function being called.
    modifier tokenOnchainFieldAllowed(string memory field, bytes4 SCinterface) {
        require(_tokensMetadataFields[field].SCinterface ==  SCinterface, "WNFT: Token metadata error");
        _;
    }

    // check if the onchain field is defined for the WNFT collection
    // checks that owner of contract allows and defined the field
    modifier collectionOnchainFieldAllowed(string memory fieldName) {
        require(_collectionMetadataFields[fieldName] == true, "WNFT: Collection metadata error");
        _;
    }

    // if minting is allowed for specific token
    modifier canMintMod(address to, uint256 tokenId) {
        require (_mintingContract.canMint(to, tokenId), "WNFT: Not allowed");
        _;
    }

    // if minting is allowed for specific token
    modifier onlyTokenOwner(uint256 tokenId) {
        require(super._isApprovedOrOwner(msg.sender, tokenId), "WNFT: Owner only");
        _;
    }

    modifier enoughFunds(uint value) {
        require( value - (wnftPriceInUSDPOW8 * 10**18/uint(_getLatestPrice())) < 10, "Wei dont match");
        _;
    }

    // metadata of the whole WNFT collection

    /*
     * @dev Constructor function
     */
    constructor (string memory name, string memory symbol, IMinting newMintingContract, Resolver ensResolver, ENS ens, bytes32 ensNode, AggregatorV3Interface newPriceFeed) ERC721(name, symbol) Ownable() {

        _mintingContract = newMintingContract;
        _ensResolver = ensResolver;
        _ens = ens;
        _ensNodeID = ensNode;
        _priceFeed = newPriceFeed;

        _onchainMetadataInterface[0x661f2816]  = true; 
        _onchainMetadataInterface[0x2421c19b]  = true;
    }

    /*
     * @dev Sets the token URI for a given token
     * Reverts if the token ID does not exist
     * @param tokenId uint256 ID of the token to set its URI
     * @param uri string URI to assign
     */
    function setTokenURI(uint256 tokenId, string calldata uri) external onlyTokenOwner(tokenId) {
        super._setTokenURI(tokenId, uri);
    }

    /*
     * @dev Sets the URI for the WNFT collection
     * @param uri string URI to assign
     */
    function setWnftUri(string calldata uri) external onlyOwner {
        _wnftUri = uri;
    }

     /*
     * @dev Function to add more onchain metadata fields for the tokens
     * the field_rules_sc points to a smart contract with Interface valid_data(tokenID, value) function
     * WNFT contract owners first add fields (name, weight etc.), with a connection to a smart contract that 
     * sets the validity rules for those fields. Then users can use setTokenMetadata function to set 
     * values for the fields.
     * @param @SCinterface The address of the interface to process the field type
     * @param @SCaddress The address of the interface to process the field type
     * @param @field The name of the field where the data will be stored.
     */
    function addTokenOnchainMetadataField(bytes4 SCinterface, address SCaddress, string memory fieldName) external onlyOwner {
        // TODO: check that field is not defined yet 

         if(_tokensMetadataFields[fieldName].SCaddress==address(0)){
            _tokensMetadataFieldNames.push(fieldName);
            tokensMetadataFieldNamesCount++;
        }

        // check SCinterface is valid
        require(_onchainMetadataInterface[SCinterface], "SCInterface not valid");

        // verify interface of the smart contract
        //IERC165 _SCaddress = IERC165(SCaddress);
        require(IERC165(SCaddress).supportsInterface(SCinterface), "SCInterface not supported");

        // set _tokensMetadataFields of the field   
        _tokensMetadataFields[fieldName].SCinterface = SCinterface;
        _tokensMetadataFields[fieldName].SCaddress = SCaddress;
        
        emit TokenOnchainMetadataFieldAdded(fieldName, _tokensMetadataFields[fieldName]);
    }

     // four functions to set token onchain metadata
    function setTokenOnchainMetadataString(uint256 tokenId, string calldata field, string calldata value) external tokenOnchainFieldAllowed(field, 0x661f2816) onlyTokenOwner(tokenId) {

        IonchainTokenDataString(_tokensMetadataFields[field].SCaddress).setData(tokenId, value);
    }

    function setTokenOnchainMetadataUint(uint256 tokenId, string calldata field, uint value) external tokenOnchainFieldAllowed(field, 0x2421c19b) onlyTokenOwner(tokenId) {

        IonchainTokenDataUint(_tokensMetadataFields[field].SCaddress).setData(tokenId, value);
    }

     /*
     * @dev Function to add fields for collection onchain metadata
     * @param @fieldName The address that will receive the minted tokens.
     * will also emit event of CollectionOnchainMetadataFieldAdded with field name
     */
    function addCollectionOnchainMetadataField(string memory fieldName) external onlyOwner {

        _collectionMetadataFields[fieldName] = true;
       
        emit CollectionOnchainMetadataFieldAdded(fieldName);
    }

    /*
     * @dev Function to set onchain metadata for collection for specific field
     * @param @fieldName The field name to set
     * @param @fieldValue The field value to set
     */
    function setCollectionOnchainMetadata(string calldata fieldName, string calldata fieldValue) external onlyOwner {  
        //vCollectionOnchainFieldAllowed(fieldName);
        if(_collectionMetadataFields[fieldName]!=true){
            _collectionMetadataFieldNames.push(fieldName);
            collectionMetadataFieldNamesCount++;
        }
        _collectionOnchainMetadata[fieldName] = fieldValue;
    }

    /*
     * @dev Function to set a minting contract
     * @param @newContract The new min
     */
    function setMintingContract(IMinting newContract) external onlyOwner {
        _mintingContract = newContract;
    }

    /*
     * @dev Function to set contract switched flag
     * @param @newContract The address of the new contract
     * will also emit event of ContractSwitch with newContract
     */
    function setContractSwitched(address newContract) external onlyOwner {
        _contractSwitched = newContract;
        emit ContractSwitch(newContract);
    }

    /*
     * @dev Function to set ens content hash
     * @param @hash new content hash for ens
     */
    function setENSContenthash(bytes calldata hash) external onlyOwner {
        _ensResolver.setContenthash(_ensNodeID, hash);
    }

    /*
     * @dev Function to set the ens resolver
     * @param @ensResolver ens resolver to set in the contract
     */
    function setENSResolver(Resolver ensResolver) external onlyOwner {
        _ensResolver = ensResolver;
    }


    function setENSRegistar(ENS ensRegistar) external onlyOwner {
        _ens = ensRegistar;
    }

    /*
     * @dev function to trasnfer ens name ownership
     * @param @newOwner The new owner for the ens name
     */
    function transferENSName(address newOwner) external onlyOwner {
        // TODO: safe transfer
        _ens.setOwner(_ensNodeID, newOwner);
    }

    /*
     * @dev Function to setEnsNode
     * @param @ensNode The ens node to be controled
     */
    function setENSNodeID(bytes32 ensNode) external onlyOwner {
        _ensNodeID = ensNode;
    }

    /*
    * @dev Function to set the minting token price
    * @param @tokenPrice The USD value of the token price for minting
    */
    function setTokenPrice(uint256 tokenPriceInTenthOfCent) external onlyOwner {
        wnftPriceInUSDPOW8 = tokenPriceInTenthOfCent*(10**5);
    }
    

    /*
    * @dev Function to mint tokens
    * @param @to The address that will receive the minted tokens.
    * @param @tokenId The token id to mint.
    */
    function mint(address to, uint256 tokenId) external payable enoughFunds(msg.value) canMintMod(to, tokenId)  {
        _doMint(to, tokenId);
    }

    /*
     * @dev Function to mint tokens and set their URI in one action
     * @param @to The address that will receive the minted tokens.
     * @param @tokenId The token id to mint.
     * @param @uri string URI to assign
     */
    function mintWithTokenURI(address to, uint256 tokenId, string calldata uri) external payable enoughFunds(msg.value) canMintMod(to, tokenId) {
        
       _doMint(to, tokenId);
        // set token URI
        super._setTokenURI(tokenId, uri);
    }

    /*
     * @dev Returns the URI of the WNFT collection
     * @return {string} WNFT uri for offchain meta data
     * May return an empty string.
     */
    function wnftUri() external view returns (string memory) { 
        return _wnftUri;
    }
   

    function tokenOnchainMetadataString(uint256 tokenId, string memory field) external view tokenOnchainFieldAllowed(field, 0x661f2816) returns (string memory) {

        return IonchainTokenDataString(_tokensMetadataFields[field].SCaddress).getData(tokenId);
    }

    function tokenOnchainMetadataUint(uint256 tokenId, string memory field) external view tokenOnchainFieldAllowed(field, 0x2421c19b) returns (uint) {
        return IonchainTokenDataUint(_tokensMetadataFields[field].SCaddress).getData(tokenId);
    }

    /*
     * @dev Function to get the collectionOnchainMetadata for specific field
     * @param @fieldName The field name to get data for
     * @return {string} Value of the collection onchain metadata for specific field
     */
    function collectionOnchainMetadata(string memory fieldName) public view  returns (string memory) {
        return _collectionOnchainMetadata[fieldName];
    }

    /*
     * @dev Function to get the minting contract
     * @return {IMinting} The minting contract
     */
    function mintingContract() external view returns (IMinting) {
         return _mintingContract;
    }


    function ensContenthash() public view returns (bytes memory){
        return _ensResolver.contenthash(_ensNodeID);
    }
   
   
    /*
     * @dev get the contract switched flag
     * @return {address} The contract switch address
     */
    function contractSwitched() external view returns (address) {
        return _contractSwitched;
    }

    /*
     * @dev Function to get ens resolver
     * @return {Resolver} the current resolver defined
     */
    function ENSResolver() external view returns (Resolver) {
        return _ensResolver; 
    }

    /*
    * @dev Function will return the ens registar contract
    * @return {ENS} ens registar contract returned
    */
    function ENSRegistar() external view returns (ENS) {
        return _ens;
    }

    /*
    * @dev Function will return the ens node id
    * @return {bytes32} ens node id returned
    */
    function ENSNodeID() external view returns (bytes32) {
        return _ensNodeID;
    }

     /*
     * @dev Function to check minting a token
     * @param @to The address that will receive the minted tokens.
     * @param @tokenId The token id to mint.
     * @return {bool} A boolean that indicates if the operation was successful.
     */
    function canMint(address to, uint256 tokenId) external view  returns (bool) {
        
        // check if taken
        return ((!super._exists(tokenId)) && _mintingContract.canMint(to, tokenId));
       
    }


     /*
     * @dev Function to get token by incremental counter index
     * @param @i uint The index using incremental token id
     * @return {uint} tokenId of real tokenId
     */
    function NthToken(uint i) external view returns (uint) {
        require(i < amount, "Token doesn't exist");
        return _keys[i];
    }


    //return Array of structure
    function getCollectionMetadataField() public view returns (string[] memory, string[] memory){
        string[]  memory id = new string[](collectionMetadataFieldNamesCount);
        string[]  memory vals = new string[](collectionMetadataFieldNamesCount);
        for (uint i = 0; i < collectionMetadataFieldNamesCount; i++) {
            id[i] = _collectionMetadataFieldNames[i];
            vals[i] = collectionOnchainMetadata(_collectionMetadataFieldNames[i]);
        }
        return (id, vals);
    }


    //return Array of structure
    function getTokenMetadataField() public view returns (string[] memory, address[] memory, bytes4[] memory){
        string[]  memory id = new string[](tokensMetadataFieldNamesCount);
        address[] memory scAddresses = new address[](tokensMetadataFieldNamesCount);
        bytes4[] memory scInterfaces = new bytes4[](tokensMetadataFieldNamesCount);
        for (uint i = 0; i < tokensMetadataFieldNamesCount; i++) {
            id[i] = _tokensMetadataFieldNames[i];
            scAddresses[i] = _tokensMetadataFields[_tokensMetadataFieldNames[i]].SCaddress;
            scInterfaces[i] = _tokensMetadataFields[_tokensMetadataFieldNames[i]].SCinterface;
        }
        return (id, scAddresses, scInterfaces);
    }


    function tokenExists(uint256 tokenId) public view returns (bool){
        return super._exists(tokenId);
    }
    

    /*
     * @dev function to do internal minting
     * @notice function is not checking balance or other things
     * @param @to who to mint for
     * @param @tokenId tokenId
     */
    function _doMint(address to, uint256 tokenId) internal {
        _mint(to, tokenId);
        // add to tokens index
        _keys.push(tokenId);
        amount =  amount + 1;
    }

    /*
     * @dev Function to get token by incremental counter index
     * @return {int} latest ETH/USD price from oracle
     */
    function _getLatestPrice() internal view returns (int) {
        (
            ,
            int price,
            ,
            ,
        ) = _priceFeed.latestRoundData();
        // for ETH / USD price is scaled up by 10 ** 8
        return price;
    }


    

}
