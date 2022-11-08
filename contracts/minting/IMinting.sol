// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;


interface IMinting{

    /**
     * @dev checks if an address can mint a specific token.
     * @param  @to   The minting address.
     * @param  @tokenId The minting token id.
     * @return {bool} true if the address can mint the token, false otherwise.
     */
    function canMint(address to, uint256 tokenId) external view returns (bool);

    /**
     * @dev performs cleanup operations after an address minted a token.
     * When implementing this function take good care of who can call it, e.g., the
     * WNFT contract, the minting address (using delegateCall), etc.
     * @param  @to   The minting address.
     * @param  @tokenId The minting token id.
     */
    function afterMint(address to, uint256 tokenId) external returns (bool);
}
