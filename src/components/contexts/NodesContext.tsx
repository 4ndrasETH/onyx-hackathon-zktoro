"use client";

import { Node } from "@/app/home/NodeTable/NodeTable";
import { noop } from "@/lib/utils";
import React from "react";
import { useLocalStorage } from "usehooks-ts";

const nodesInitialState: Node[] = [];

export const ReadNodesContext = React.createContext<Node[]>(nodesInitialState);

export const SetNodesContext = React.createContext<{
  append: (node: Node) => void;
  update: <T extends keyof Node>(did: string, prop: T, value: Node[T]) => void;
}>({ append: noop, update: noop });

export function useReadNodes() {
  return React.useContext(ReadNodesContext);
}

export function useSetNodes() {
  return React.useContext(SetNodesContext);
}

export function NodesContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [nodes, setNodes] = useLocalStorage<Node[]>("nodes", nodesInitialState);

  const setters = React.useMemo(() => {
    return {
      append: (node: Node) => {
        setNodes((prevNodes) => [...prevNodes, node]);
      },
      update: <T extends keyof Node>(did: string, prop: T, value: Node[T]) => {
        setNodes((prevNodes) => {
          return prevNodes.map((node) => {
            if (node.did === did) {
              return { ...node, [prop]: value };
            }
            return node;
          });
        });
      },
    };
  }, [setNodes]);

  return (
    <ReadNodesContext.Provider value={nodes}>
      <SetNodesContext.Provider value={setters}>
        {children}
      </SetNodesContext.Provider>
    </ReadNodesContext.Provider>
  );
}
