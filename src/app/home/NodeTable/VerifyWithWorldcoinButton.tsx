import { VerifyReply } from "@/app/api/worldcoin/verify/route";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast/useToast";
import { GlobeIcon, ReloadIcon } from "@radix-ui/react-icons";
import { CredentialType, IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import React, { useCallback } from "react";

export default function VerifyWithWorldcoinButton({
  updateNode,
}: {
  updateNode: (nullifierHash: string) => void;
}) {
  const handleVerify = useCallback(async (result: ISuccessResult) => {
    console.log("Proof received from IDKit:\n", JSON.stringify(result)); // Log the proof from IDKit to the console for visibility
    const reqBody = {
      merkle_root: result.merkle_root,
      nullifier_hash: result.nullifier_hash,
      proof: result.proof,
      credential_type: result.credential_type,
      action: process.env.NEXT_PUBLIC_WLD_ACTION_NAME,
      signal: "",
    };
    console.log(
      "Sending proof to backend for verification:\n",
      JSON.stringify(reqBody)
    ); // Log the proof being sent to our backend for visibility

    const reqBodyString = JSON.stringify(reqBody);
    const res: Response = await fetch("/api/worldcoin/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: reqBodyString,
    });
    const { code, detail, data }: VerifyReply = await res.json();

    if (code === "success") {
      console.log("Successful response from backend:\n", {
        code,
        detail,
        data,
      }); // Log the response from our backend for visibility
      updateNode(data);
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: detail,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IDKitWidget
      action={process.env.NEXT_PUBLIC_WLD_ACTION_NAME!}
      app_id={process.env.NEXT_PUBLIC_WLD_APP_ID!}
      onSuccess={() => {
        toast({
          variant: "default",
          title: "Success!",
          description:
            "Your verified your identity with Worldcoin. It's time to issue a proof for your node",
        });
      }}
      handleVerify={handleVerify}
      credential_types={[CredentialType.Orb, CredentialType.Phone]}
      autoClose
    >
      {({ open }) => (
        <Button
          variant="secondary"
          onClick={() => {
            open();
          }}
        >
          <GlobeIcon className="mr-2 h-4 w-4" />
          Verify With World ID
        </Button>
      )}
    </IDKitWidget>
  );
}
