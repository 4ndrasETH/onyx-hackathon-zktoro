"use client";
import { EthrDID } from "ethr-did";
import React from "react";
import { useMagic } from "./MagicContext";
import { useWeb3 } from "./Web3Context";

export const AuthUserContext = React.createContext<
  { user: string; did: EthrDID } | undefined
>(undefined);

export function useAuthUser() {
  const authUser = React.useContext(AuthUserContext);
  if (typeof authUser === "undefined") {
    throw new Error("useAuthUser must be used within a AuthUserContext");
  }
  return authUser;
}

export function AuthUserProvider({
  user,
  children,
}: {
  children: React.ReactNode;
  user: string;
}) {
  const web3 = useWeb3();
  const magic = useMagic();

  const ethrDid = new EthrDID({
    identifier: user,
    provider: web3,
    chainNameOrId: magic.getChainId(),
  });

  return (
    <AuthUserContext.Provider
      value={{
        user,
        did: ethrDid,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
}
