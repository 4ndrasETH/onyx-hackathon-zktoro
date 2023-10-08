import { useCallback, useEffect, useState } from "react";
import { Node } from "../NodeTable";
import { delay } from "@/lib/utils";

export default function useVerifyVP({ vp }: Pick<Node, "vp">) {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const getVPAndVerify = useCallback(async () => {
    if (!vp || verified) return;
    setError(undefined);
    setLoading(true);

    console.log("verifying vp");
    const newStatusRes = await fetch(`/api/vp`, { cache: "no-store",headers:{'Cache-Control':'no-store'} });
    const newStatusJson = await newStatusRes.json();
    console.log("verifying vp result", newStatusJson);

    if (newStatusJson.error) {
      console.error(newStatusJson.error);
      setLoading(false);
      setError(newStatusJson.error);
      return;
    }
    if (!newStatusJson.status) {
      setVerified(false);
      setError("Verification failed");
    }
    setVerified(true);
    setLoading(false);
  }, [verified, vp]);

  useEffect(() => {
    getVPAndVerify();
  }, [getVPAndVerify]);

  return {
    loading,
    verified,
    error,
    getVPAndVerify,
  };
}
