import { ethers } from "ethers";

const rpcUrl = "https://rpc-mumbai.maticvigil.com/";
const chainId = 80001;
const registry = "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b";

export const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
export const ethrProvider = {
  name: `maticmum`,
  chainId,
  rpcUrl,
  registry,
  gasSource: "",
};
