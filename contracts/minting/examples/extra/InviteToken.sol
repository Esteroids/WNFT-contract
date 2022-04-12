// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract InviteToken is ERC20 {

    constructor(string memory name, string memory symbol, uint256 totalToMint) ERC20(name, symbol)  {
        _mint(msg.sender, totalToMint);
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function burn(address to, uint amount) external {
        _burn(to, amount);
    }
    
   
}