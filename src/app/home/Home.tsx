"use client";

import React from "react";
import NavBar from "@/components/ui/NavBar";
import ProfileMenu from "./ProfileMenu";
import H3 from "@/components/ui/Typography/H3";
import NodeTable, { Node } from "./NodeTable/NodeTable";
import { RocketIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import {
  NodesContextProvider,
  useReadNodes,
} from "@/components/contexts/NodesContext";
function AddNodeTip() {
  const nodes = useReadNodes();

  if (nodes.length > 0) return null;
  return (
    <Alert>
      <RocketIcon className="h-4 w-4" />
      <AlertTitle>Tip:</AlertTitle>
      <AlertDescription>
        Add a new node for your strategy below
      </AlertDescription>
    </Alert>
  );
}

function IssueProofTip() {
  const nodes = useReadNodes();

  if (nodes.every(({ vc }) => vc !== undefined)) return null;
  return (
    <Alert>
      <RocketIcon className="h-4 w-4" />
      <AlertTitle>Tip:</AlertTitle>
      <AlertDescription>
        Issue a proof that will control your node
      </AlertDescription>
    </Alert>
  );
}

export default function Home() {
  return (
    <NodesContextProvider>
      <NavBar button={<ProfileMenu />} />
      <main className="px-10 flex flex-col gap-4">
        <H3>Your strategy nodes</H3>
        <AddNodeTip />
        <IssueProofTip />
        <NodeTable />
      </main>
    </NodesContextProvider>
  );
}
