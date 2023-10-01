import { useAuthUser } from "@/components/contexts/AuthUserContext";
import { Button } from "@/components/ui/Button";
import { TableCell, TableRow } from "@/components/ui/Table";
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import React, { useCallback } from "react";
import { Node } from "./NodeTable";
import { delay } from "@/lib/utils";

export interface CreateNewNodeRowProps {
  setNodes: (nodes: Node[]) => void;
}

export default function CreateNewNodeRow({ setNodes }: CreateNewNodeRowProps) {
  const { did } = useAuthUser();
  const [loading, setLoading] = React.useState(false);
  const handleClick = useCallback(
    (did: string) => async () => {
      setLoading(true);
      const res = await fetch("/api/node", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ did }),
      });
      const json = await res.json();
      await delay(1000);
      setNodes([{ did: json.subjectDid, verified: false }]);
      setLoading(false);
    },
    [setNodes]
  );

  return (
    <TableRow key="new-node">
      <TableCell className="font-medium italic">New Node</TableCell>
      <TableCell colSpan={2} className="text-right">
        <Button onClick={handleClick(did.did)} disabled={loading}>
          {loading ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlusIcon className="mr-2 h-4 w-4" />
          )}
          Create
        </Button>
      </TableCell>
    </TableRow>
  );
}
