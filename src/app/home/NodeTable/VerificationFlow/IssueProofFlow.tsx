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
import { CheckIcon, IdCardIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Issuer, createVerifiableCredentialJwt } from "did-jwt-vc";
import { EthrDID } from "ethr-did";
import React, { useCallback, useState } from "react";
import { Node } from "../NodeTable";
import { Progress } from "@/components/ui/Progress";
// @ts-expect-error
import { Web3Storage } from "web3.storage";

function getAccessToken() {
  // If you're just testing, you can paste in a token
  // and uncomment the following line:
  // return 'paste-your-token-here'

  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
  return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

async function storeFiles(vp: string) {
  const blob = new Blob([vp]);
  const file = new File([blob], "vp.txt");
  const client = makeStorageClient();
  const cid = await client.put([file]);
  console.log("stored files with cid:", cid);
  return cid;
}

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
  updateNode: (vp: string, file?: string) => void;
}

const steps = [
  { text: "Create Proof template" },
  { text: "Add a signing delegate keypair to your DID" },
  { text: "Sign Proof with delegate keypair" },
  { text: "Upload Proof to node" },
  { text: "Verify the node's signature" },
  { text: "Upload Proof to IPFS" },
];

function IssueProofModal({
  open,
  onOpenChange,
  did: subjectDid,
  worldIdResult,
  nullifierHash,
  updateNode,
}: Props) {
  const { did: issuerDid } = useAuthUser();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleClick = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const createVCTemplateRequestBody: CreateVCTemplateRequestBody = {
        issuer: issuerDid.did,
        subject: subjectDid,
        worldIdResult,
        nullifierHash,
      };
      // Get VC template
      const vcTemplateRes = await fetch(`/api/vc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createVCTemplateRequestBody),
      });
      const vcTemplateJson = await vcTemplateRes.json();
      if (vcTemplateJson.error) {
        setError("Error creating VC template");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
        setStep(0);
        setLoading(false);
        return;
      }
      const vcTemplate = vcTemplateJson.vc;
      await delay(2000);

      setStep((prev) => prev + 1);
      // Add signing delegate
      await issuerDid.createSigningDelegate();

      setStep((prev) => prev + 1);
      // Sign VC
      // const signedJWT = await issuerDid.signJWT(vcTemplate);

      const signedJWT = await createVerifiableCredentialJwt(
        vcTemplate,
        convertIssuer(issuerDid)
      );
      console.log("signed VC", signedJWT);

      await delay(1000);

      setStep((prev) => prev + 1);
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
        setError("Error uploading VC to node");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
        setStep(0);
        setLoading(false);
        return;
      }

      const signedVc = verifyVcJson.vc;

      setStep((prev) => prev + 1);
      const newStatusRes = await fetch(`/api/vp`, {
        method: "POST",
        body: JSON.stringify({ vc: signedVc, date: Date.now() }),
        cache: "no-store",
        headers: { "Cache-Control": "no-store" },
      });
      const newStatusJson = await newStatusRes.json();

      if (newStatusJson.error) {
        console.error(JSON.stringify(newStatusJson, null, 2));
        setError(`Error verifying node's signature: ${newStatusJson.error}`);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
        setStep(0);
        setLoading(false);
        return;
      }
      if (!newStatusJson.status) {
        setError("Error verifying node's signature");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
        setStep(0);
        setLoading(false);
        return;
      }

      setStep((prev) => prev + 1);
      const ipfsRes = await storeFiles(newStatusJson.vp);

      updateNode(newStatusJson.vp, ipfsRes);
      setStep((prev) => prev + 1);
      setLoading(false);
      toast({
        variant: "default",
        title: "Success!",
        description: "Proof issued and uploaded to node",
      });
    } catch (err) {
      setError(`Error: ${(err as Error).message}`);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      setStep(0);
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
          <DialogDescription>
            Issuing a verifiable proof and uploading it to the node
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <div className="flex flex-col gap-2">
            {steps.map(({ text }, i) => (
              <div
                key={i}
                className={`flex items-center justify-start gap-2 ${
                  i !== step ? "text-slate-300" : ""
                }`}
              >
                <div
                  className={`rounded-full p-1 bg-slate-400 ${
                    i !== step ? "opacity-20" : ""
                  } ${step > i ? "bg-green-500" : ""}`}
                >
                  {loading && i === step ? (
                    <ReloadIcon className="h-5 w-5 text-primary-foreground animate-spin" />
                  ) : (
                    <CheckIcon className={`h-4 w-4 text-primary-foreground`} />
                  )}
                </div>
                <p
                  className={`font-medium text-lg ${
                    step > i ? "line-through" : ""
                  }`}
                >{`${i + 1}. ${text}`}</p>
              </div>
            ))}
            {error ? (
              <p className="font-medium text-destructive text-sm">{error}</p>
            ) : null}
            <Progress className="mt-4" value={step * (100 / steps.length)} />
          </div>
        </div>

        <DialogFooter className="">
          <Button
            onClick={handleClick}
            disabled={loading}
            size="lg"
            className="w-full"
          >
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
