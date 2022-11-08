// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "./IMinting.sol";


contract Minting is IMinting {
    function canMint(address, uint256) external pure override returns (bool){
        return true;
    }

    // afterMint is left empty for this demo contract
    function afterMint(address to, uint256 tokenId) external override returns (bool) {
        return true;
    }
}
