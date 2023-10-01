"use client";

import { useCallback, useEffect, useState } from "react";
import { useReadUser, useSetUser } from "../contexts/UserContext";
import { providers } from "ethers";
import { Web3Provider } from "../contexts/Web3Context";
import { redirect } from "next/navigation";
import { useMagic } from "../contexts/MagicContext";
import { AuthUserProvider } from "../contexts/AuthUserContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useReadUser();
  const setUser = useSetUser();
  const magic = useMagic();

  const [loaded, setLoaded] = useState(false);
  const [web3, setWeb3] = useState<providers.Web3Provider | undefined>(
    undefined
  );
  const [provider, setProvider] = useState<any>(undefined);

  const checkIfAuthenticated = useCallback(async () => {
    if (!user) {
      setLoaded(true);
      return;
    }

    const magicProvider = await magic.getProvider();
    const account = await magic.getAccount(magicProvider);

    // If user wallet is no longer connected
    if (!account) {
      magic.logout();
      setLoaded(true);
      return;
    }

    if (account !== user) {
      setUser(account);
      setLoaded(true);
      return;
    }

    const web3Provider = new providers.Web3Provider(magicProvider);

    // EventHandler for when user changes account
    magicProvider.on("accountsChanged", (accounts: string[]) => {
      const newUser = accounts[0];
      if (!newUser) {
        magic.logout();
        return;
      }
      setUser(newUser);
    });

    setWeb3(web3Provider);
    setProvider(magicProvider);
    setLoaded(true);
  }, [magic, setUser, user]);

  useEffect(() => {
    checkIfAuthenticated();
  }, [checkIfAuthenticated]);

  if (!loaded) {
    return <div>Loading...</div>;
  }

  if (!user || !provider || !web3) {
    return redirect("/login");
  }

  return (
    <Web3Provider value={web3}>
      <AuthUserProvider user={user}>{children}</AuthUserProvider>
    </Web3Provider>
  );
}

export default AuthGuard;
