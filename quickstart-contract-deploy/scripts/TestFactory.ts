// Usage: pnpm hardhat run --network <network> scripts/run-vigil.ts

import hre from "hardhat";

async function main() {

    const [owner, otherAccount] = await hre.ethers.getSigners();
    const ownerAddress = await owner.getAddress();

    const testFactory = await hre.ethers.deployContract("TestFactory");
    await testFactory.waitForDeployment();
    console.log(`test factory deployed to ${testFactory.target}`);

    const tx = await testFactory.createTest(ownerAddress);
    const receipt = await tx.wait();
    // console.log(receipt!.logs);
    const address = receipt!.logs[0].args[0];
    console.log(`new test deployed at: ${address}`);

    const lock = await hre.ethers.getContractAt("OwnableTest", address);
    console.log("unlock time:", await lock.unlockTime());
    await lock.setNumber(5);
    const number = await lock.number();
    console.log("number:", number);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });