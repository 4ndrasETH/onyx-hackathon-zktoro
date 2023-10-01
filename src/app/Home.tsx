"use client";

import { useAuthUser } from "@/components/contexts/AuthUserContext";
import React from "react";
import { useWeb3 } from "@/components/contexts/Web3Context";
import { useMagic } from "@/components/contexts/MagicContext";
import { EthrDID } from "ethr-did";

export default function Home() {
  const user = useAuthUser();
  const web3 = useWeb3();
  const magic = useMagic();

  const ethrDid = new EthrDID({
    identifier: user,
    provider: web3,
    chainNameOrId: magic.getChainId(),
  });

  console.log(ethrDid);

  return <div>{ethrDid.address}</div>;
}
