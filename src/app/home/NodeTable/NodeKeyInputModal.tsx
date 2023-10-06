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
import { IdCardIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import React, { useCallback, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { truncateDidKey } from "@/lib/utils";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";

function NodeDidCard({ did }: { did: string }) {
  return (
    <Alert>
      <IdCardIcon className="h-4 w-4" />
      <AlertTitle>Node&apos;s DID</AlertTitle>
      <AlertDescription className="text-muted-foreground">
        {truncateDidKey(did)}
      </AlertDescription>
    </Alert>
  );
}

interface Props {
  trigger: React.ReactNode;
  onSubmit: (nodeDid: string) => void;
}

export default function NodeKeyInputModal({ trigger, onSubmit }: Props) {
  const [key, setKey] = useState("");
  const debouncedKey = useDebounce<string>(key, 500);
  const [loading, setLoading] = useState(false);
  const [nodeDid, setNodeDid] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const transformPublicKeyToDid = useCallback(async (keyParam: string) => {
    setLoading(true);
    if (keyParam.length <= 0) {
      setNodeDid(undefined);
      setLoading(false);
      return;
    }
    const res = await fetch("/api/node", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicKey: keyParam }),
    });
    const json = await res.json();
    if (json.error) {
      setErrorMessage(json.error);
      setLoading(false);
      return;
    }
    setNodeDid(`did:key:${json.nodeDid}`);
    setLoading(false);
  }, []);

  useEffect(() => {
    transformPublicKeyToDid(debouncedKey);
  }, [debouncedKey, transformPublicKeyToDid]);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add node</DialogTitle>
          <DialogDescription>
            Specify the public key of your node
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="publicKey" className="text-right">
              Public key
            </Label>
            <Input
              id="publicKey"
              value={key}
              className="col-span-3"
              onChange={({ target: { value: inputValue } }) =>
                setKey(inputValue)
              }
            />
          </div>
          {nodeDid ? <NodeDidCard did={nodeDid} /> : null}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={loading || !nodeDid}
            onClick={() => {
              if (!nodeDid) return;
              onSubmit(nodeDid);
            }}
          >
            {loading ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlusIcon className="mr-2 h-4 w-4" />
            )}
            Add Node
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
