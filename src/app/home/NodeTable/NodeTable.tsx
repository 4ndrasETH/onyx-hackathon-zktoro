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
import { Button } from "@/components/ui/Button";
import { FileIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export interface Node {
  did: string;
  vp?: string;
  worldIdResult?: string;
  nullifierHash?: string;
  file?: string;
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
        {nodes.map(({ did, vp, worldIdResult, nullifierHash, file }) => {
          console.log({ did, vp, worldIdResult, nullifierHash, file });
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
                <div className="flex items-center justify-end gap-2">
                  <VerificationFlow
                    did={did}
                    vp={vp}
                    worldIdResult={worldIdResult}
                    nullifierHash={nullifierHash}
                  />
                  {file ? (
                    <Button asChild variant="link" size="sm">
                      <Link
                        href={`https://${file}.ipfs.w3s.link/vp.txt`}
                        target="_blank"
                      >
                        {" "}
                        <FileIcon className="h-3 w-3" />
                      </Link>
                    </Button>
                  ) : null}
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
