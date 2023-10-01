import { ethers } from "ethers";

const rpcUrl = "https://rpc-mumbai.maticvigil.com/";
const chainId = 80001;
const registry = "https://mumbai.polygonscan.com/";

export const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
export const ethrProvider = {
  name: `0x${chainId.toString(16)}`,
  chainId,
  rpcUrl,
  registry,
  gasSource: "",
};
