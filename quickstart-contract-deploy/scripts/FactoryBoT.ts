import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { FactoryBoT, DeviceBoT } from "../typechain-types";

import hre from "hardhat";

describe("FactoryBoT", function () {
  let factoryBot: FactoryBoT;
  let owner: Signer;
  let ownerAddress: string;

  before(async function () {
    [owner] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();

    const _FactoryBoT = await hre.ethers.getContractFactory("FactoryBoT");
    factoryBot = await _FactoryBoT.deploy();

    console.log("FactoryBoT deployed to:", await factoryBot.getAddress());
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      console.log("Owner:", await factoryBot.owner());
      console.log("ownerAddress:", ownerAddress);
    });
  });

});
