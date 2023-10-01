"use client";

import React, { useEffect, useState } from "react";
import { Magic } from "magic-sdk";
import { useSetUser } from "./UserContext";
import { ethrProvider } from "@/lib/config";

interface MagicContextValue {
  connect: () => Promise<string[]>;
  getProvider: () => Promise<any>;
  getAccount: (provider: any) => Promise<string>;
  logout: () => Promise<void>;
  getChainId: () => number;
}

export const MagicContext = React.createContext<MagicContextValue | undefined>(
  undefined
);

export function useMagic() {
  const magic = React.useContext(MagicContext);
  if (typeof magic === "undefined") {
    throw new Error("useMagic must be used within a MagicContext");
  }
  return magic;
}

export function MagicProvider({ children }: { children: React.ReactNode }) {
  const [magic, setMagic] = useState<MagicContextValue | undefined>(undefined);
  const setUser = useSetUser();

  useEffect(() => {
    if (typeof window == "undefined") return;

    const magic = new Magic(
      process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY as string,
      {
        network: {
          rpcUrl: ethrProvider.rpcUrl,
          chainId: ethrProvider.chainId,
        },
      }
    );

    setMagic({
      connect: () => magic.wallet.connectWithUI(),
      getProvider: () => magic.wallet.getProvider(),
      getAccount: async (provider: any) => {
        const accounts: string[] = await provider.request({
          method: "eth_accounts",
        });
        return accounts[0];
      },
      logout: async () => {
        await magic.user.logout();
        setUser(undefined);
      },
      getChainId: () => ethrProvider.chainId,
    });
  }, [setUser]);

  if (!magic) return null;

  return (
    <MagicContext.Provider value={magic}>{children}</MagicContext.Provider>
  );
}
