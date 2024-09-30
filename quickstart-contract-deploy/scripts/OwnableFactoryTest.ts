// Usage: pnpm hardhat run --network <network> scripts/run-vigil.ts

import hre from "hardhat";

async function main() {
    const [owner] = await hre.ethers.getSigners();
    const ownerAddress = await owner.getAddress();


    const testFactory = await hre.ethers.deployContract("TestFactory", [ownerAddress]);
    await testFactory.waitForDeployment();
    console.log(`contract deployed to ${testFactory.target}`);

    console.log("ownerAddress:", ownerAddress);
    console.log("Owner:", await testFactory.owner());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });