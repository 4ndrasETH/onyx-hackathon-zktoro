import { CreateVCTemplateRequestBody } from "@/app/api/vc/route";
import { useAuthUser } from "@/components/contexts/AuthUserContext";
import { useDialogState } from "@/components/hooks/useDialogState";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { toast } from "@/components/ui/Toast/useToast";
import Muted from "@/components/ui/Typography/Muted";
import { delay } from "@/lib/utils";
import { DialogProps } from "@radix-ui/react-dialog";
import { IdCardIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Issuer, createVerifiableCredentialJwt } from "did-jwt-vc";
import { EthrDID } from "ethr-did";
import React, { useCallback } from "react";
import { Node } from "./NodeTable";

function convertIssuer(issuerDid: EthrDID) {
  const issuer = {
    did: issuerDid.did,
    signer: issuerDid.signer,
    alg: "ES256K",
  };
  return issuer as Issuer;
}

interface Props
  extends Required<Pick<DialogProps, "open" | "onOpenChange">>,
    Pick<Node, "did"> {
  worldIdResult: string;
  nullifierHash: string;
  updateNode: (vp: string) => void;
}

function IssueProofModal({
  open,
  onOpenChange,
  did: subjectDid,
  worldIdResult,
  nullifierHash,
  updateNode,
}: Props) {
  const { did: issuerDid } = useAuthUser();
  const [loading, setLoading] = React.useState(false);
  const [statusMsg, setStatusMsg] = React.useState<string | undefined>(
    undefined
  );

  const handleClick = useCallback(async () => {
    setLoading(true);

    try {
      const createVCTemplateRequestBody: CreateVCTemplateRequestBody = {
        issuer: issuerDid.did,
        subject: subjectDid,
        worldIdResult,
        nullifierHash,
      };
      // Get VC template
      const vcTemplateRes = await fetch(`/api/vc?`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createVCTemplateRequestBody),
      });
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
      // const signedJWT = await issuerDid.signJWT(vcTemplate);

      const signedJWT = await createVerifiableCredentialJwt(
        vcTemplate,
        convertIssuer(issuerDid)
      );
      console.log("signed VC", signedJWT);

      await delay(1000);

      setStatusMsg("Verifying Proof...");
      await delay(1000);
      // Post VC to Node and Verify
      const verifyVcRes = await fetch("/api/vc/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vc: signedJWT,
          issuerPublicKey: issuerDid.address,
          holderDid: subjectDid,
        }),
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

      const newStatusRes = await fetch(`/api/vp`, { cache: "no-store" });
      const newStatusJson = await newStatusRes.json();

      if (newStatusJson.error) {
        console.error(JSON.stringify(newStatusJson, null, 2));
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
        setStatusMsg(undefined);
        setLoading(false);
        return;
      }
      if (!newStatusJson.status) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
        setStatusMsg(undefined);
        setLoading(false);
        return;
      }

      updateNode(newStatusJson.vp);
      setStatusMsg(undefined);
      setLoading(false);
      toast({
        variant: "default",
        title: "Success!",
        description: "Proof issued and uploaded to node",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      setStatusMsg(undefined);
      setLoading(false);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issuerDid, subjectDid, updateNode]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          {false ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <IdCardIcon className="mr-2 h-4 w-4" />
          )}
          Issue Proof
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Issue Proof</DialogTitle>
          {/* <DialogDescription>
            1. Verify yourself with World ID
          </DialogDescription> */}
        </DialogHeader>
        <div className="flex flex-col">
          <Muted>{statusMsg}</Muted>
        </div>

        <DialogFooter>
          <Button onClick={handleClick} disabled={loading}>
            {loading ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <IdCardIcon className="mr-2 h-4 w-4" />
            )}
            Start issuance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function IssueProofFlow({
  did,
  updateNode,
  worldIdResult,
  nullifierHash,
}: Pick<Props, "did" | "worldIdResult" | "nullifierHash" | "updateNode">) {
  const { key, isOpen, openModal, closeModal } = useDialogState();

  return (
    <IssueProofModal
      key={key}
      did={did}
      worldIdResult={worldIdResult}
      nullifierHash={nullifierHash}
      updateNode={updateNode}
      open={isOpen}
      onOpenChange={(open) => {
        if (open) openModal();
        else closeModal();
      }}
    />
  );
}
