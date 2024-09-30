import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
const ONE_GWEI = 1_000_000_000;

describe("LockFactory", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployLockFactoryFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const lockFactory = await hre.ethers.deployContract("LockFactory");

    return { lockFactory, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should create lock from Factory", async function () {
      const { lockFactory } = await loadFixture(deployLockFactoryFixture);

      const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

      await expect(lockFactory.createLock(unlockTime, { value: ONE_GWEI }))
        .to.emit(lockFactory, "LockCreated");
    });
  });    
});
