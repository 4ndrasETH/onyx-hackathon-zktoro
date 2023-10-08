import { ethers } from "ethers";

const rpcUrl = process.env.NEXT_PUBLIC_NETWORK_RPC_URL as string;
const chainId = process.env.NEXT_PUBLIC_CHAIN_ID as string;
const registry = process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS as string;
const name = process.env.NEXT_PUBLIC_NETWORK_NAME as string;

export const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
export const ethrProvider = {
  name,
  chainId,
  rpcUrl,
  registry,
  gasSource: "",
};
