// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract InviteToken is ERC20 {

    address private burnningContract;
    address private owner;

    constructor(string memory name, string memory symbol, uint256 totalToMint) ERC20(name, symbol)  {
        owner = msg.sender;
        _mint(msg.sender, totalToMint);
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function burn(address to, uint amount) external {
        require(msg.sender == burnningContract, "burning is allowed only from the burning contract");

        _burn(to, amount);
    }

    function setBurningContract (address _burningContract) external {
        require (msg.sender == owner, "Only owner is allowed to set the burning contract");

        burnningContract = _burningContract;
    }
    
   
}