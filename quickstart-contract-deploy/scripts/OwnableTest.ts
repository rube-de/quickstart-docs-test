// Usage: pnpm hardhat run --network <network> scripts/run-vigil.ts

import hre from "hardhat";

async function main() {
    const [owner] = await hre.ethers.getSigners();
    const ownerAddress = await owner.getAddress();


    const ownableTest = await hre.ethers.deployContract("OwnableTest", [ownerAddress]);
    await ownableTest.waitForDeployment();
    console.log(`contract deployed to ${ownableTest.target}`);

    console.log("ownerAddress:", ownerAddress);
    console.log("Owner:", await ownableTest.owner());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });