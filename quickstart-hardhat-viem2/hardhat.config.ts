// import "@oasisprotocol/sapphire-hardhat";
import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const accounts = process.env.PRIVATE_KEY
? [process.env.PRIVATE_KEY]
: {
  mnemonic: "test test test test test test test test test test test junk",
  path: "m/44'/60'/0'/0",
  initialIndex: 0,
  count: 20,
  passphrase: "",
};

const config: HardhatUserConfig = {
  solidity: "0.8.24",
	networks: {
		'sapphire': {
      url: 'https://sapphire.oasis.io',
      chainId: 0x5afe, // 23294
      accounts,
		},
		'sapphire-testnet': {
      url: 'https://testnet.sapphire.oasis.dev',
      chainId: 0x5aff, // 23295
      accounts,
		},
		'sapphire-localnet': {
      url: 'http://127.0.0.1:8545',
      chainId: 0x5afd, // 23293
      accounts,
		},
      'hardhat': {
         chainId: 31337, // the default chain ID used by Hardhat Network's blockchain
      },
      localhost: {
         url: 'http://127.0.0.1:8545',
         chainId: 31337, // the default chain ID used by Hardhat Network's blockchain
      },
	},
};

export default config;
