// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../IMinting.sol";


/*
 * An minting contract where only accounts with an invitation token 
 * can mint. The invitation token is an ERC20 token that the contract burns
 * after minting.
 */
contract InvitationBased is Ownable, IMinting {
    ERC20 internal invitationToken;

    /*
     * A token can be minted if:
     * 1. it's not minted yet, and
     * 2. the minting address has an invitation token.
     */
    function canMint(address to, uint256) public view override returns (bool){
        require(invitationToken.balanceOf(to) > 0, "Invitation Token is needed for minting.");

        return true;
    }

    // afterMint burns an invitation token after minting
    function afterMint(address to, uint256 tokenId) external override returns (bool) {

        // burns the invitation token
        invitationToken.transfer(address(0), 1);

        return true;
    }

    /*
     * set the address of the InvitationToken contract
     * @param _invitationToken address of InvitationToken contract
     */
    function setInvitationToken(ERC20 _invitationToken) external onlyOwner {
        invitationToken = _invitationToken;
    }


}
