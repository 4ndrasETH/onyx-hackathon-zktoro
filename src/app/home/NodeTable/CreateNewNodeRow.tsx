import { useAuthUser } from "@/components/contexts/AuthUserContext";
import { Button } from "@/components/ui/Button";
import { TableCell, TableRow } from "@/components/ui/Table";
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import React, { useCallback } from "react";
import { Node } from "./NodeTable";
import { delay } from "@/lib/utils";
import NodeKeyInputModal from "./NodeKeyInputModal";

export interface CreateNewNodeRowProps {
  setNodes: (nodes: Node[]) => void;
}

export default function CreateNewNodeRow({ setNodes }: CreateNewNodeRowProps) {
  const { did } = useAuthUser();

  return (
    <TableRow key="new-node">
      <TableCell className="font-medium italic">New Node</TableCell>
      <TableCell colSpan={2} className="text-right">
        <NodeKeyInputModal
          onSubmit={(nodeDid: string) => {
            setNodes([{ did: nodeDid, verified: false }]);
          }}
          trigger={
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add
            </Button>
          }
        />
      </TableCell>
    </TableRow>
  );
}
