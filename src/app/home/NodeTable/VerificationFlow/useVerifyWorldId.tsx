import { useCallback, useEffect, useState } from "react";
import { Node } from "../NodeTable";
import { VerifyReply } from "@/app/api/worldcoin/verify/route";

export default function useVerifyWorldId({
  worldIdResult,
}: Pick<Node, "worldIdResult">) {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const verifyWorldcoin = useCallback(async () => {
    console.log("verifying WorldIdResult", worldIdResult, verified);
    if (!worldIdResult || verified) return;
    setError(undefined);
    setLoading(true);

    const res: Response = await fetch("/api/worldcoin/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: worldIdResult,
    });
    const { code }: VerifyReply = await res.json();

    if (code === "success") {
      setVerified(true);
      setLoading(false);
    } else {
      setError("WorldID Verification failed");
      setLoading(false);
    }
  }, [verified, worldIdResult]);

  useEffect(() => {
    verifyWorldcoin();
  }, [worldIdResult, verifyWorldcoin]);

  return { loading, verified, verifyWorldcoin, error };
}
