// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./extra/InviteToken.sol";

import "../IMinting.sol";


/*
 * An minting contract where only accounts with an invitation token 
 * can mint. The invitation token is an ERC20 token that the contract burns
 * after minting.
 */
contract MintingInvitationBased is Ownable, IMinting {
    InviteToken internal _invitationToken;

    constructor(InviteToken invitationToken)   {
        _invitationToken = invitationToken;
    }

    /*
     * Check if the address has invitation token to mint the token.
     */
    function canMint(address to, uint256) public view override returns (bool){
        return bool(_invitationToken.balanceOf(to) > 0);
    }

    // afterMint burns an invitation token after minting
    function afterMint(address to, uint256 ) external override returns (bool) {

         require(_invitationToken.balanceOf(to) > 0, "Missing token");
         
        // burns the invitation token
        _invitationToken.burn(to, 1);
        return true;
    }

    /*
     * set the address of the InvitationToken contract
     * @param invitationToken address of InvitationToken contract
     */
    function setInvitationToken(InviteToken invitationToken) external onlyOwner {
        _invitationToken = invitationToken;
    }


}
