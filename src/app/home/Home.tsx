"use client";

import React, { Fragment, useCallback, useState } from "react";
import NavBar from "@/components/ui/NavBar";
import ProfileMenu from "./ProfileMenu";
import H3 from "@/components/ui/Typography/H3";
import NodeTable, { Node } from "./NodeTable/NodeTable";
import { RocketIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";

export default function Home() {
  const [nodes, setNodes] = useState<Node[]>([]);

  console.log(nodes);

  return (
    <Fragment>
      <NavBar button={<ProfileMenu />} />
      <main className="px-10 flex flex-col gap-4">
        <H3>Your strategy nodes</H3>
        {nodes.length <= 0 ? (
          <Alert>
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Tip:</AlertTitle>
            <AlertDescription>
              Add a new node for your strategy below
            </AlertDescription>
          </Alert>
        ) : null}
        {nodes.some(({ vc }) => vc === undefined) ? (
          <Alert>
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Tip:</AlertTitle>
            <AlertDescription>
              Issue a proof that you will control the node
            </AlertDescription>
          </Alert>
        ) : null}
        <NodeTable nodes={nodes} setNodes={setNodes} />
      </main>
    </Fragment>
  );
}
