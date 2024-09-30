// SPDX-License-Identifier: MIT
//

//import {Sapphire} from "@oasisprotocol/sapphire-contracts/contracts/Sapphire.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.0;


contract OwnableTest is Ownable {

  constructor(address _owner) Ownable(_owner) {

    require(_owner != address(0), "Invalid owner");
  }

}

