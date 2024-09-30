// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import { Lock } from "./Lock.sol";

contract LockFactory {
    address[] locks;

    event LockCreated(address indexed newLock);

    constructor() {}

    function createLock(uint _unlockTime) public payable returns (Lock) {
        Lock newLock = new Lock(_unlockTime);
        locks.push(address(newLock));
        emit LockCreated(address(newLock));
        return newLock;
    }
}