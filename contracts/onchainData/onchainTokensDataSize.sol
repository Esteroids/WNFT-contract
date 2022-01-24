// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IonchainTokensData.sol";
import "../WNFT.sol";


/*
 * A contract of 'size' metadata for Citadef, allows 20% of big fishes (size=3)
 */

contract onchainTokenDataSize is IonchainTokenDataUint {
    modifier onlyWNFTContract() { 
        require(msg.sender == address(_wnft), "sender unknown");
        _;
    }


    // 0 nofish
    // 1 tiny fish
    // 2 fish-fish
    // 3 meganieal the big fish
    // 4 happy giant fish
    // 5 fish of fishes
    mapping(uint256 => uint) private _size;

    uint private _amountMeganieal;
    WNFT private _wnft;

    constructor(WNFT wnft) {
        _wnft = wnft;

        // though uint default is currently 0, 
        // we set it explicitly to avoid breaking changes in future Solidity versions
        _amountMeganieal = 0;
    }

    /**
     * #dev Checks if onchain metdata data is valid for a given token id 
     * @param  @tokenId uint256 tokenId     id of the token
     * @param  @value uint  calldata      value of the metadata
     * @param  @data bytes[] memory         bytes[0] is amount of tokens existing
     * @return {bool}         true if metadata is valid, false otherwise
     */
    function validData(uint256, uint value) public view override returns (bool) {
        // we only allow value = 0(nofish), 2 (fish-fish) or 3 (meganieal) sizes now
        // meganieal is allowed to be maximum 20% of fishes
        // TODO: check token exists
        // TODO: extend to other sizes (1,4,5)

        bool resp;
        uint amount = _wnft.amount();

        // 2 == small, and we always allow fish to be small
        if (value == 2)
            resp = true;
        
        // 3 == big
        if ((value == 3) && ((amount-1) % 5 <= _amountMeganieal))
            resp = true;

        return resp;
    }

    /*
     * @dev Checks if onchain metdata data is valid for a given token id 
     * @param  @tokenId uint256 tokenId     id of the token
     * @param  @value uint  value      value of the metadata
     * @param  @data bytes[] memory         any extra data needed to make the decision
     * @return {bool}         true if metadata is valid, false otherwise
     */
    function setData(uint256 tokenId, uint value) external override onlyWNFTContract {
        // remark: we assume that the tokenId is checked by 
        // the WNFT contract calling this function

        require(validData(tokenId, value), "invalid data");

        if (value == 3)
            _amountMeganieal++;
        
        _size[tokenId] = value;
    }

    /*
     * @dev gets onchain data for a given token id 
     * @return {uint}         returns the metadata if it exists
     */
    function getData(uint256 tokenId) external view override returns (uint) {
        return _size[tokenId];
    }

     /*
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IonchainTokenDataUint).interfaceId; 
    }

    function getWNFT() external view returns (WNFT) {
        return _wnft;
    }

    function setWNFT(WNFT wnft) external onlyWNFTContract {
        _wnft = wnft;
    }
}

