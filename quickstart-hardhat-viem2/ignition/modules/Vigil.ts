import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const VigilModule = buildModule("VigilModule", (m) => {
  const vigil = m.contract("Vigil", [], {});
  return { vigil };
});

export default VigilModule;
