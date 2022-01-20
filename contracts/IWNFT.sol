// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
interface IWNFT {
    
    /*
     * @dev Sets the token URI for a given token
     * Reverts if the token ID does not exist
     * @param tokenId uint256 ID of the token to set its URI
     * @param uri string URI to assign
     */
    function setTokenURI(uint256 tokenId, string calldata uri) external;

    /*
     * @dev Returns the URI of the WNFT collection
     * @return {string} WNFT uri for offchain meta data
     * May return an empty string.
     */
    function wnftUri() external view returns (string memory);

    /*
     * @dev Sets the URI for the WNFT collection
     * @param uri string URI to assign
     */
    function setWnftUri(string calldata uri) external;


    /*
     * @dev Function to add more onchain metadata fields for the tokens
     * the field_rules_sc points to a smart contract with Interface valid_data(tokenID, value) function
     * WNFT contract owners first add fields (name, weight etc.), with a connection to a smart contract that 
     * sets the validity rules for those fields. Then users can use setTokenMetadata function to set 
     * values for the fields.
     * @param @SCinterface The address of the interface to process the field type
     * @param @SCaddress The address of the interface to process the field type
     * @param @field The token id to mint.
     */
    function addTokenOnchainMetadataField(bytes4 SCinterface, address SCaddress, string memory fieldName) external;

    // four functions to set token onchain metadata
    function setTokenOnchainMetadataString(uint256 tokenId, string calldata field, string calldata value) external;

    function setTokenOnchainMetadataUint(uint256 tokenId, string calldata field, uint value) external;

    function tokenOnchainMetadataString(uint256 tokenId, string memory field) external view returns (string memory);

    function tokenOnchainMetadataUint(uint256 tokenId, string memory field) external view returns (uint);

    /*
     * @dev Function to add fields for collection onchain metadata
     * @param @fieldName The address that will receive the minted tokens.
     * will also emit event of CollectionOnchainMetadataFieldAdded with field name
     */
    function addCollectionOnchainMetadataField(string memory fieldName) external;

    /*
     * @dev Function to set onchain metadata for collection for specific field
     * @param @fieldName The field name to set
     * @param @fieldValue The field value to set
     */
    function setCollectionOnchainMetadata(string calldata fieldName, string calldata fieldValue) external;

    /*
     * @dev Function to get the collectionOnchainMetadata for specific field
     * @param @fieldName The field name to get data for
     * @return {string} Value of the collection onchain metadata for specific field
     */
    function collectionOnchainMetadata(string memory fieldName) external view returns (string memory);

    /*
     * @dev Function to get the minting contract
     * @return {IMinting} The minting contract
     */
    function mintingContract() external view returns (IMinting);
   
    /*
     * @dev Function to set a minting contract
     * @param @newContract The new min
     */
    function setMintingContract(IMinting newContract) external;

    /*
     * @dev Function to set contract switched flag
     * @param @newContract The address of the new contract
     * will also emit event of ContractSwitch with newContract
     */
    function setContractSwitched(address newContract) external;

    /*
     * @dev get the contract switched flag
     * @return {address} The contract switch address
     */
    function contractSwitched() external view returns (address);

    /*
     * @dev Function to set ens content hash
     * @param @hash new content hash for ens
     */
    function setENSContenthash(bytes calldata hash) external;

    /*
     * @dev Function to get ens resolver
     * @return {Resolver} the current resolver defined
     */
    function ENSResolver() external view returns (Resolver);


    /*
     * @dev Function to set the ens resolver
     * @param @ensResolver ens resolver to set in the contract
     */
    function setENSResolver(Resolver ensResolver) external;

    /*
     * @dev function to trasnfer ens name ownership
     * @param @newOwner The new owner for the ens name
     */
    function transferENSName(address newOwner) external;

    /*
     * @dev Function to setEnsNode
     * @param @ensNode The ens node to be controled
     */
    function setENSNode(bytes32 ensNode) external;

    /*
    * @dev Function will return the ens node id
    * @return {bytes32} ens node id returned
    */
    function ENSNode() external view returns (bytes32);


    /*
    * @dev Function to set the minting token price
    * @param @tokenPrice The USD value of the token price for minting
    */
    function setTokenPrice(int256 tokenPrice) external;

    /*
    * @dev Function to mint tokens
    * @param @to The address that will receive the minted tokens.
    * @param @tokenId The token id to mint.
    */
    function mint(address to, uint256 tokenId) external payable;

     /*
     * @dev Function to check minting a token
     * @param @to The address that will receive the minted tokens.
     * @param @tokenId The token id to mint.
     * @return {bool} A boolean that indicates if the operation was successful.
     */
    function canMint(address to, uint256 tokenId) external view  returns (bool);

    /*
     * @dev Function to mint tokens and set their URI in one action
     * @param @to The address that will receive the minted tokens.
     * @param @tokenId The token id to mint.
     * @param @uri string URI to assign
     */
    function mintWithTokenURI(address to, uint256 tokenId, string calldata uri) external payable;

     /*
     * @dev Function to get token by incremental counter index
     * @param @i uint The index using incremental token id
     * @return {uint} tokenId of real tokenId
     */
    function NthToken(uint i) external view returns (uint);

    /*
     * @dev Function to get token by incremental counter index
     * @return {int} latest ETH/USD price from oracle
     */
    function getLatestPrice() external view returns (int);

}
