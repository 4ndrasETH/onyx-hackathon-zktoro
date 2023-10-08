import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import CreateNewNodeRow, { CreateNewNodeRowProps } from "./CreateNewNodeRow";
import VerifyStatus from "./VerifyStatus";
import ControllingStatus from "./ControllingStatus";
import { truncateDidKey } from "@/lib/utils";
import { useReadNodes, useSetNodes } from "@/components/contexts/NodesContext";
import { MinusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/Button";
import RemoveNode from "./RemoveNode";

export interface Node {
  did: string;
  vc?: string;
  verified: boolean;
}

export default function NodeTable() {
  const nodes = useReadNodes();
  const { append, update, remove } = useSetNodes();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">DID</TableHead>
          <TableHead className="text-right">Verified</TableHead>
          <TableHead className="text-right">Controlling</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {nodes.map(({ did, verified, vc }) => (
          <TableRow key={did}>
            <TableCell className="font-medium">
              <div className="flex items-center justify-center gap-2">
                <RemoveNode
                  onConfirm={() => {
                    remove(did);
                  }}
                />
                {truncateDidKey(did)}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <VerifyStatus
                status={verified}
                vc={vc}
                updateNode={(verified) => {
                  update(did, "verified", verified);
                }}
              />
            </TableCell>
            <TableCell className="text-right">
              <ControllingStatus
                did={did}
                vc={vc}
                updateNode={(vc: string) => {
                  update(did, "vc", vc);
                }}
              />
            </TableCell>
          </TableRow>
        ))}
        <CreateNewNodeRow
          append={(node: Node) => {
            append(node);
          }}
        />
      </TableBody>
    </Table>
  );
}
