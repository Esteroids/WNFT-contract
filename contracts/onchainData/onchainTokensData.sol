// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IonchainTokensData.sol";
import "../WNFT.sol";


/*
 * Collection of interfaces for functions that handle onchain metadata for tokens.
 * Each function handles a different type of metadata, e.g. string, int, bool etc.
 */

contract onchainTokenDataString is IonchainTokenDataString {
    string private _tokendata;
    WNFT private _wnft;

    constructor(WNFT wnft) {
        _wnft = wnft;
    }

    /*
     * @dev Checks if onchain metdata data is valid for a given token id 
     * @param  @tokenId uint256 tokenId     id of the token
     * @param  @value string  calldata      value of the metadata
     * @param  @data bytes[] memory         any extra data needed to make the decision
     * @return {bool}         true if metadata is valid, false otherwise
     */
    function validData(uint256, string calldata) public pure override returns (bool) {
        return true;
    }

    /*
     * @dev sets onchain data for a given token id 
     * @param  @tokenId uint256 tokenId     id of the token
     * @param  @value string  calldata      value of the metadata
     * @param  @data bytes[] memory         any extra data needed to make the decision
     */
    function setData(uint256, string calldata) external override {
        _tokendata = "set";
    }

    /*
     * @dev gets onchain data for a given token id 
     * @param  @tokenId uint256 tokenId     id of the token
     * @return {string}                     returns the metadata if it exists
     */
    function getData(uint256) external pure override returns (string memory) {
        return "";
    }

    /*
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IonchainTokenDataString).interfaceId; 
    }

}

contract onchainTokenDataUint is IonchainTokenDataUint {
    uint private _tokendata;

    WNFT private _wnft;

    constructor(WNFT wnft) {
        _wnft = wnft;
    }

    /**
     * #dev Checks if onchain metdata data is valid for a given token id 
     * @param  @tokenId uint256 tokenId     id of the token
     * @param  @value uint  calldata      value of the metadata
     * @param  @data bytes[] memory         any extra data needed to make the decision
     * @return {bool}         true if metadata is valid, false otherwise
     */
    function validData(uint256, uint) public pure override returns (bool) {
        return true;
    }

    /*
     * @dev Checks if onchain metdata data is valid for a given token id 
     * @param  @tokenId uint256 tokenId     id of the token
     * @param  @value uint  value      value of the metadata
     * @param  @data bytes[] memory         any extra data needed to make the decision
     * @return {bool}         true if metadata is valid, false otherwise
     */
    function setData(uint256, uint) external override {
        _tokendata = 1;
    }

    /*
     * @dev gets onchain data for a given token id 
     * @return {uint}         returns the metadata if it exists
     */
    function getData(uint256) external pure override returns (uint) {
        return 0;
    }

     /*
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IonchainTokenDataUint).interfaceId; 
    }
}
