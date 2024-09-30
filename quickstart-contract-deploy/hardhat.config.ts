import { HardhatUserConfig } from "hardhat/config";
import '@oasisprotocol/sapphire-hardhat';
import "@nomicfoundation/hardhat-toolbox";

const TEST_HDWALLET = {
	mnemonic: "test test test test test test test test test test test junk",
	// mnemonic: "feature icon grief chair buffalo true crystal palm hollow way allow hunt",
	path: "m/44'/60'/0'/0",
	initialIndex: 0,
	count: 20,
	passphrase: "",
};
const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : TEST_HDWALLET;


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
	},
};

export default config;
