// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import { OwnableTest } from "./OwnableTest.sol";


contract TestFactory is Ownable {
    address[] tests;

    event TestCreated(address indexed newTest);

    constructor(address _owner) Ownable(_owner) {}

    function createTest(address _owner) public payable returns (OwnableTest) {
        OwnableTest newTest = new OwnableTest(_owner);
        tests.push(address(newTest));
        emit TestCreated(address(newTest));
        return newTest;
    }
}