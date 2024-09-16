# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```


## Vigil

### Deploy with Ignition 

```sh
pnpm hardhat ignition deploy ignition/modules/Vigil.ts
```

### Hardaht Test Vigil

```sh
pnpm hardhat test
```

### Test Vigil with local hardhat node

start hardhat node
```sh
pnpm hardhat node
```

then run the script
```sh
pnpm hardhat run scripts/run-vigil-hardhat.ts
```

### Test Vigil with sapphire-localnet

start sapphire localnet
```sh
docker run -it -p8545:8545 -p8546:8546 ghcr.io/oasisprotocol/sapphire-localnet -test-mnemonic
```

then run the script
```sh
pnpm hardhat run scripts/run-vigil.ts --network sapphire-localnet
```