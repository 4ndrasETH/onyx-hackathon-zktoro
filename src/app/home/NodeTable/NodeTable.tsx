import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import CreateNewNodeRow from "./CreateNewNodeRow";
import { truncateDidKey } from "@/lib/utils";
import { useReadNodes, useSetNodes } from "@/components/contexts/NodesContext";
import RemoveNode from "./RemoveNode";
import VerificationFlow from "./VerificationFlow/VerificationFlow";

export interface Node {
  did: string;
  vp?: string;
  worldIdResult?: string;
  nullifierHash?: string;
}

export default function NodeTable() {
  const nodes = useReadNodes();
  const { append, update, remove } = useSetNodes();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">DID</TableHead>
          <TableHead className="text-right">Verified</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {nodes.map(({ did, vp, worldIdResult, nullifierHash }) => {
          console.log({ did, vp, worldIdResult, nullifierHash });
          return (
            <TableRow key={did}>
              <TableCell className="font-medium text-left">
                <div className="flex items-center justify-start gap-2">
                  <RemoveNode
                    onConfirm={() => {
                      remove(did);
                    }}
                  />
                  {truncateDidKey(did)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end">
                  <VerificationFlow
                    did={did}
                    vp={vp}
                    worldIdResult={worldIdResult}
                    nullifierHash={nullifierHash}
                  />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
        <CreateNewNodeRow
          append={(node: Node) => {
            append(node);
          }}
        />
      </TableBody>
    </Table>
  );
}
