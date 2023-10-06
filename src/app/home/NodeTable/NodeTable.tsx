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

export interface Node {
  did: string;
  vc?: string;
  verified: boolean;
}

interface Props {
  nodes: Node[];
  setNodes: CreateNewNodeRowProps["setNodes"];
}

export default function NodeTable({ nodes, setNodes }: Props) {
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
        {nodes.length <= 0 ? (
          <CreateNewNodeRow setNodes={setNodes} />
        ) : (
          nodes.map(({ did, verified, vc }) => (
            <TableRow key={did}>
              <TableCell className="font-medium">
                {truncateDidKey(did)}
              </TableCell>
              <TableCell className="text-right">
                <VerifyStatus
                  status={verified}
                  vc={vc}
                  updateNode={(verified) => {
                    // @ts-expect-error
                    setNodes((prevNodes: Node[]) =>
                      prevNodes.map((node: Node) => {
                        if (node.did === did) {
                          return { ...node, verified };
                        }
                        return node;
                      })
                    );
                  }}
                />
              </TableCell>
              <TableCell className="text-right">
                <ControllingStatus
                  did={did}
                  vc={vc}
                  updateNode={(vc: string) => {
                    // @ts-expect-error
                    setNodes((prevNodes: Node[]) =>
                      prevNodes.map((node: Node) => {
                        if (node.did === did) {
                          return { ...node, vc };
                        }
                        return node;
                      })
                    );
                  }}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
