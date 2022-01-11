// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;


interface IMinting{
    function canMint(address to, uint256 tokenId ) external view returns (bool);
}
