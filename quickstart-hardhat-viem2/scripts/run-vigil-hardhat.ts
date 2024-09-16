// Usage: pnpm hardhat run --network <network> scripts/run-vigil.ts

import hre from "hardhat";

// import { sapphireLocalnet, sapphireHttpTransport, wrapWalletClient } from '@oasisprotocol/sapphire-viem-v2';
import { createWalletClient, zeroAddress, toBytes, toHex, parseEther, hexToBytes, bytesToString } from "viem";
import { mnemonicToAccount } from 'viem/accounts';

async function main() {
  const account = mnemonicToAccount('test test test test test test test test test test test junk');

  const [owner, otherAccount] = await hre.viem.getWalletClients();
  const publicClient = await hre.viem.getPublicClient();
  const vigil = await hre.viem.deployContract('Vigil', [], {});
  // console.log(vigil);
  console.log('Vigil deployed to:', vigil.address);


  const hash = await vigil.write.createSecret([
    'ingredient',
    20 /* seconds */,
    toHex(toBytes('brussels sprouts')),
  ]);
  console.log('Storing a secret in', hash);
  const receipt = await publicClient.waitForTransactionReceipt({hash});
  
  try {
    console.log('Checking the secret');
    const revealSecretCall = await vigil.read.revealSecret([0]);
    console.log('Uh oh. The secret was available!');
    process.exit(1);
  } catch (e: any) {
    console.log('failed to fetch secret:', e.message);
  }
  console.log('Waiting...');
  console.log("Block time:", await getBlocktime(publicClient));

  // Manually generate some transactions to increment local Docker
  // container block
  if ( publicClient.chain.id == 23293 || publicClient.chain.id == 31337) {
    await generateTraffic(30, owner);
  } else {
    await new Promise((resolve) => setTimeout(resolve, 30_000));
  }
  console.log("Block time:", await getBlocktime(publicClient));
  console.log('Checking the secret again');
  // await (await vigil.revealSecret(0)).wait(); // Reveal the secret.
  // const secret = await vigil.revealSecret.staticCallResult(0); // Get the value.
  const revealSecretCall = await vigil.read.revealSecret([0]);

  console.log('The secret ingredient is', bytesToString(hexToBytes(revealSecretCall)));
}

async function generateTraffic(n: number, walletClient) {
  console.log(walletClient);
  for (let i = 0; i < n; i++) {
    await walletClient.sendTransaction({
      account: walletClient.account.address,
      to: "0x000000000000000000000000000000000000dEaD",
      value: parseEther('0.01'),
    });
  };
}

async function getBlocktime(publicClient) {
  const blockNumber = await publicClient.getBlockNumber();
  const block = await publicClient.getBlock({blockNumber});
  return block.timestamp;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});