// Usage: pnpm hardhat run --network <network> script
import { Address, createWalletClient, createPublicClient, getContract } from 'viem';
import { sapphireLocalnet, sapphireTestnet, sapphireHttpTransport, wrapWalletClient } from '@oasisprotocol/sapphire-viem-v2';

import { privateKeyToAccount } from "viem/accounts";
import { abi, bytecode} from "../artifacts/contracts/Vigil.sol/Vigil.json"




async function main() {
  const transport = sapphireHttpTransport();
	const chain = sapphireLocalnet;
	const publicClient = createPublicClient({ chain, transport });
  
  const account = privateKeyToAccount(process.env.PRIVATE_KEY as Address);
  const walletClient = await wrapWalletClient(
		createWalletClient({
			account,
			chain,
			transport,
		}),
	);

  // Get the contract factory and deploy
  const deployTxHash = await walletClient.deployContract({
		account,
		bytecode: bytecode,
		abi: abi,
	});
	const deployTxReceipt = await publicClient.waitForTransactionReceipt({
		hash: deployTxHash,
	});
  console.log('Vigil deployed to:', deployTxReceipt.address);


	const vigil = getContract({
		address: deployTxReceipt.contractAddress,
		abi: abi,
    publicClient: publicClient,
    walletClient: walletClient,
	});

  const tx = await vigil.write.createSecret([
    'ingredient',
    30 /* seconds */,
    Buffer.from('brussels sprouts'),]
  )

  console.log('Storing a secret in', tx);

  try {
    console.log('Checking the secret');
    const revealSecretCall = await vigil.read.revealSecret();

    console.log('Uh oh. The secret was available!', revealSecretCall);
    process.exit(1);
  } catch (e: any) {
    console.log('Failed to fetch secret:', e.message);
  }

  console.log('Waiting...');

  await new Promise((resolve) => setTimeout(resolve, 30_000));

  console.log('Checking the secret again');
  
  const revealSecretCall = await vigil.read.revealSecret();

  // const secret = Buffer.from(revealSecretCall[0].slice(2), 'hex').toString();
  console.log('The secret ingredient is', revealSecretCall);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
