import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { toBytes, toHex } from "viem";

describe("Vigil", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployVigilFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const vigil = await hre.viem.deployContract("Vigil", [], {});

    const publicClient = await hre.viem.getPublicClient();

    return {
      vigil,
      owner,
      otherAccount,
      publicClient,
    };
  }

  describe("Secerets", function () {
    it("Should add new secrets and read it", async function () {
      const { vigil, publicClient } = await loadFixture(deployVigilFixture);
      const longevity = 30n;
      const unlockTime = BigInt(await time.latest()) + longevity;
      await vigil.write.createSecret([
        'ingredient',
        longevity /* seconds */,
        toHex(toBytes('brussels sprouts'))
      ]);
      // secret not expired yet -> throw error
      expect(vigil.read.revealSecret([0])).to.throw;
      // increase time
      await time.increaseTo(unlockTime+1n);
      // check if secret is available
      expect(await vigil.read.revealSecret([0])).to.equal(toHex(toBytes('brussels sprouts')));
    })
  })
});
