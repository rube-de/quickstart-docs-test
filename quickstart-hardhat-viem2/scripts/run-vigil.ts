// Usage: pnpm hardhat run --network <network> scripts/run-vigil.ts

import hre from "hardhat";

import { sapphireLocalnet, sapphireHttpTransport, wrapWalletClient } from '@oasisprotocol/sapphire-viem-v2';
import { createWalletClient, toBytes, toHex, hexToBytes, parseEther, bytesToString } from "viem";
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts';
import { sapphire, sapphireTestnet } from 'viem/chains';

async function main() {
  const transport = sapphireHttpTransport();
  let account;
  let chain;
  switch (hre.network.name) {
    case 'sapphire':
      chain = sapphire;
      account = privateKeyToAccount(process.env.PRIVATE_KEY as Address);
      break;
    case 'sapphire-testnet':
      chain = sapphireTestnet;
      account = privateKeyToAccount(process.env.PRIVATE_KEY as Address);
      break;
    default:
      chain = sapphireLocalnet;
      account = mnemonicToAccount('test test test test test test test test test test test junk');
      break;
  }
  const publicClient = await hre.viem.getPublicClient({chain, transport});
  const walletClient = await wrapWalletClient(createWalletClient({
      account, chain, transport
  }));
  const keyedClient = {
      public: publicClient,
      wallet: walletClient
  }
  const vigil = await hre.viem.deployContract('Vigil', [], {client:keyedClient});
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
  if ( publicClient.chain.id == 31337) {
    await generateTraffic(2, keyedClient);
  } 
  await new Promise((resolve) => setTimeout(resolve, 30_000));
  
  console.log("Block time:", await getBlocktime(publicClient));
  console.log('Checking the secret again');

  const revealSecretCall = await vigil.read.revealSecret([0]);

  console.log('The secret ingredient is', bytesToString(hexToBytes(revealSecretCall)));
}

async function generateTraffic(n: number, client) {
  for (let i = 0; i < n; i++) {
    const hash = await client.wallet.sendTransaction({
      to: "0x000000000000000000000000000000000000dEaD",
      value: parseEther('0.01'),
    });
    await client.public.waitForTransactionReceipt({ hash });
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