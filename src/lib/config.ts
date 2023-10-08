import { ethers } from "ethers";

const rpcUrl = process.env.NEXT_PUBLIC_NETWORK_RPC_URL;
const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
const registry = process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS;
const name = process.env.NEXT_PUBLIC_NETWORK_NAME;

export const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
export const ethrProvider = {
  name,
  chainId,
  rpcUrl,
  registry,
  gasSource: "",
};
