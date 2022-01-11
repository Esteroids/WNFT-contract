// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;


import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

/*
 * Collection of interfaces for functions that handle onchain metadata for tokens.
 * Each function handles a different type of metadata, e.g. string, int, bool etc.
 */

// TODO: add function to modify and get address of WNFT contract

interface IonchainTokenDataString is IERC165 {
    /*
     * @dev Checks if onchain metdata data is valid for a given token id 
     * @param  @tokenId uint256 tokenId     id of the token
     * @param  @value string  calldata      value of the metadata
     * @param  @data bytes[] memory         any extra data needed to make the decision
     * @return {bool}         true if metadata is valid, false otherwise
     */
    function validData(uint256 tokenId, string calldata value) external view returns (bool);

    /*
     * @dev sets onchain data for a given token id 
     * @param  @tokenId uint256 tokenId     id of the token
     * @param  @value string  calldata      value of the metadata
     * @param  @data bytes[] memory         any extra data needed to make the decision
     */
    function setData(uint256 tokenId, string calldata value) external;

    /*
     * @dev gets onchain data for a given token id 
     * @param  @tokenId uint256 tokenId     id of the token
     * @return {string}                     returns the metadata if it exists
     */
    function getData(uint256 tokenId) external view returns (string memory);

}

interface IonchainTokenDataUint is IERC165 {
    /*
     * @dev Checks if onchain metdata data is valid for a given token id 
     * @param  @tokenId uint256 tokenId     id of the token
     * @param  @value uint  value      value of the metadata
     * @param  @data bytes[] memory         any extra data needed to make the decision
     * @return {bool}         true if metadata is valid, false otherwise
     */
    function validData(uint256 tokenId, uint value) external view returns (bool);

    /*
     * @dev sets onchain data for a given token id 
     * @param  @tokenId uint256 tokenId     id of the token
     * @param  @value uint  calldata      value of the metadata
     * @param  @data bytes[] memory         any extra data needed to make the decision
     */
    function setData(uint256 tokenId, uint value) external;

    /*
     * @dev gets onchain data for a given token id 
     * @return {uint}         returns the metadata if it exists
     */
    function getData(uint256 tokenId) external view returns (uint);
}

// interface IonchainTokenDataInt is ERC165 {
//     /**
//      * @dev Checks if onchain metdata data is valid for a given token id 
//      * @param  @tokenId uint256 tokenId     id of the token
//      * @param  @value int  calldata      value of the metadata
//      * @param  @data bytes[] memory         any extra data needed to make the decision
//      * @return {bool}         true if metadata is valid, false otherwise
//      */
//     function validData(uint256 tokenId, int calldata value, bytes[] memory data) external view returns (bool);

//     /// @notice Query if a contract implements an interface
//     /// @param interfaceID The interface identifier, as specified in ERC-165
//     /// @dev Interface identification is specified in ERC-165. This function
//     ///  uses less than 30,000 gas.
//     /// @return `true` if the contract implements `interfaceID` and
//     ///  `interfaceID` is not 0xffffffff, `false` otherwise
//     function supportsInterface(bytes4 interfaceID) external view returns (bool);
// }

// interface IonchainTokenDataBool is ERC165 {
//     /**
//      * @dev Checks if onchain metdata data is valid for a given token id 
//      * @param  @tokenId uint256 tokenId     id of the token
//      * @param  @value bool  calldata      value of the metadata
//      * @param  @data bytes[] memory         any extra data needed to make the decision
//      * @return {bool}         true if metadata is valid, false otherwise
//      */
//     function validData(uint256 tokenId, bool calldata value, bytes[] memory data) external view returns (bool);
// }
