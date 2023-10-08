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
import { truncateDidKey } from "@/lib/utils";
import { useReadNodes, useSetNodes } from "@/components/contexts/NodesContext";
import RemoveNode from "./RemoveNode";
import VerifyWithWorldcoinButton from "./VerifyWithWorldcoinButton";
import IssueProofFlow from "./IssueProofFlow";

export interface Node {
  did: string;
  vc?: string;
  worldcoin?: string;
  verified: boolean;
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
        {nodes.map(({ did, verified, vc, worldcoin }) => (
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
              {vc ? (
                <div className="flex items-center justify-end">
                  <VerifyStatus
                    status={verified}
                    vc={vc}
                    updateNode={(verified) => {
                      update(did, "verified", verified);
                    }}
                  />
                </div>
              ) : worldcoin ? (
                <IssueProofFlow
                  did={did}
                  worldcoin={worldcoin}
                  updateNode={(vc) => {
                    update(did, "vc", vc);
                  }}
                />
              ) : (
                <VerifyWithWorldcoinButton
                  updateNode={(worldcoin) => {
                    update(did, "worldcoin", worldcoin);
                  }}
                />
              )}
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
