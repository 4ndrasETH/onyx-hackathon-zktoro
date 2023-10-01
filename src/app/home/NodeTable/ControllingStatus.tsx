import { useAuthUser } from "@/components/contexts/AuthUserContext";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast/useToast";
import Muted from "@/components/ui/Typography/Muted";
import Small from "@/components/ui/Typography/Small";
import { delay } from "@/lib/utils";
import { CheckIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import React, { useCallback } from "react";

interface Props {
  did: string;
  vc?: string;
  updateNode: (vc: string) => void;
}

export default function ControllingStatus({
  did: subjectDid,
  vc,
  updateNode,
}: Props) {
  const { did: issuerDid } = useAuthUser();
  const [loading, setLoading] = React.useState(false);
  const [statusMsg, setStatusMsg] = React.useState<string | undefined>(
    undefined
  );

  const handleClick = useCallback(async () => {
    setLoading(true);
    // Get VC template
    const vcTemplateRes = await fetch(
      `/api/vc?issuer=${issuerDid.did}&subject=${subjectDid}`
    );
    const vcTemplateJson = await vcTemplateRes.json();
    if (vcTemplateJson.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      setStatusMsg(undefined);
      setLoading(false);
      return;
    }
    const vcTemplate = vcTemplateJson.vc;

    setStatusMsg("Creating signing delegate...");
    await delay(2000);
    // Add signing delegate
    await issuerDid.createSigningDelegate();

    setStatusMsg("Signing Proof...");
    // Sign VC
    const signedJWT = await issuerDid.signJWT(vcTemplate);
    await delay(1000);

    setStatusMsg("Verifying Proof...");
    await delay(1000);
    // Post VC to Node and Verify
    const verifyVcRes = await fetch("/api/vc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vc: signedJWT }),
    });
    const verifyVcJson = await verifyVcRes.json();
    if (verifyVcJson.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      setStatusMsg(undefined);
      setLoading(false);
      return;
    }
    const signedVc = verifyVcJson.vc;
    updateNode(signedVc);
    setStatusMsg(undefined);
    setLoading(false);
  }, [issuerDid, subjectDid, updateNode]);

  if (vc) {
    return (
      <div className="flex items-center justify-end">
        <div className="rounded-full bg-green-500 p-0.5">
          <CheckIcon className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>
    );
  }

  if (statusMsg) {
    return (
      <div className="flex items-center justify-end italic">
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        <Muted>{statusMsg}</Muted>
      </div>
    );
  }

  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading ? (
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <PlusIcon className="mr-2 h-4 w-4" />
      )}
      Issue Proof
    </Button>
  );
}