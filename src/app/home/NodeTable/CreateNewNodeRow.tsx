import { useAuthUser } from "@/components/contexts/AuthUserContext";
import { Button } from "@/components/ui/Button";
import { TableCell, TableRow } from "@/components/ui/Table";
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import React, { useCallback } from "react";
import { Node } from "./NodeTable";
import { delay } from "@/lib/utils";
import NodeKeyInputModal from "./NodeKeyInputModal";

export interface CreateNewNodeRowProps {
  append: (node: Node) => void;
}

export default function CreateNewNodeRow({ append }: CreateNewNodeRowProps) {
  return (
    <TableRow key="new-node">
      <TableCell className="font-medium italic">New Node</TableCell>
      <TableCell colSpan={2} className="text-right">
        <NodeKeyInputModal
          onSubmit={(nodeDid: string) => {
            append({ did: nodeDid, verified: false });
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
