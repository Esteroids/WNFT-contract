// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import "../../WNFT.sol";
import "../IMinting.sol";


/*
 * An minting contract allowing all minting up to some maximum amount.
 * The maximmum amount can be modified by contract owner 
 */
contract MintingLimitedAmount is Ownable, IMinting {
    WNFT public wnft;
    uint public maxAmount;

    constructor() {
        // though uint default is currently 0, 
        // we set it explicitly to avoid breaking changes in future Solidity versions
        maxAmount = 0;
    }

    /*
     * checks if a token can be minted. In this minting contract we actually don't use the parameters to and tokenId, 
     * but keep it to be compatible with IMinting interface.
     * We don't check if WNFT is nonzero, to save the gas of checking. 
     * The user of the contract should take care of it. If they don't, it fails.
     * @param  to address who mints the token
     * @param  tokenId uint256 ID of the token
     * @return bool true if token can be minted. false otherwise.
     */
    function canMint(address, uint256) public view override returns (bool){
        require(wnft.amount() < maxAmount, "Minting: reached maximum amount.");

        return true;
    }

    /*
     * Increase the number allowed maximum amount of tokens. 
     * There are no "decereaseAmount" or setAmount functions to avoid conflicts (like, an owner decreasing the max
     * amount after WNFT tokens were already mintd).
     * @param IncreaseAmount uint amount in which we increase the maximum
     */
    function increaseMaxAmount(uint increaseAmount) external onlyOwner {
        maxAmount += increaseAmount;
    }


    /*
     * set the address of the WNFT contract
     * @param WNFT address of wnft contract
     */
    function setWNFT(WNFT newWnft) external onlyOwner {
        wnft = newWnft;
    }


}
