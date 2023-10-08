import { Button } from "@/components/ui/Button";
import { TableCell, TableRow } from "@/components/ui/Table";
import { PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import { Node } from "./NodeTable";
import NodeKeyInputModal from "./NodeKeyInputModal";
import { useDialogState } from "@/components/hooks/useDialogState";

export interface CreateNewNodeRowProps {
  append: (node: Node) => void;
}

export default function CreateNewNodeRow({ append }: CreateNewNodeRowProps) {
  const { key, isOpen, openModal, closeModal } = useDialogState();
  return (
    <TableRow key="new-node">
      <TableCell className="font-medium italic">New Node</TableCell>
      <TableCell colSpan={2} className="text-right">
        <NodeKeyInputModal
          key={key}
          open={isOpen}
          onOpenChange={(toState: boolean) => {
            if (toState) {
              openModal();
            } else {
              closeModal();
            }
          }}
          onSubmit={(nodeDid: string) => {
            append({ did: nodeDid, verified: false });
            closeModal();
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
