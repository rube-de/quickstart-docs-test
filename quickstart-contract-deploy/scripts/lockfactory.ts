// Usage: pnpm hardhat run --network <network> scripts/run-vigil.ts

import hre from "hardhat";
import { now } from "lodash";

async function main() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;
    const unlockTime =  now() + ONE_YEAR_IN_SECS;

    const [owner, otherAccount] = await hre.ethers.getSigners();

    const lockFactory = await hre.ethers.deployContract("LockFactory");
    await lockFactory.waitForDeployment();
    console.log(`lock factory deployed to ${lockFactory.target}`);

    const tx = await lockFactory.createLock(unlockTime, { value: ONE_GWEI });
    const receipt = await tx.wait();
    // console.log(receipt!.logs);
    const address = receipt!.logs[0].args[0];
    console.log(`new lock deployed at: ${address}`);

    const lock = await hre.ethers.getContractAt("Lock", address);
    console.log("unlock time:", await lock.unlockTime());
    await lock.setNumber(5);
    const number = await lock.number();
    console.log("number:", number);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });