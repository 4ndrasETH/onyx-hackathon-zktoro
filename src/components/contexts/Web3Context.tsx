"use client";

import { providers } from "ethers";
import React from "react";

export const Web3Context = React.createContext<
  providers.Web3Provider | undefined
>(undefined);

export function useWeb3() {
  const web3 = React.useContext(Web3Context);
  if (typeof web3 === "undefined") {
    throw new Error("useWeb3 must be used within a Web3ContextProvider");
  }
  return web3;
}

export const Web3Provider = Web3Context.Provider;
