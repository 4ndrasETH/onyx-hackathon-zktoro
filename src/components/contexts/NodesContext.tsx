"use client";

import { Node } from "@/app/home/NodeTable/NodeTable";
import { noop } from "@/lib/utils";
import React from "react";
import { useLocalStorage } from "usehooks-ts";

const nodesInitialState: Node[] = [];

export const ReadNodesContext = React.createContext<Node[]>(nodesInitialState);

export const SetNodesContext = React.createContext<{
  append: (node: Node) => void;
  update: (did: string, newNode: Partial<Node>) => void;
  remove: (did: string) => void;
}>({ append: noop, update: noop, remove: noop });

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
      update: (did: string, newNode: Partial<Node>) => {
        setNodes((prevNodes) => {
          return prevNodes.map((node) => {
            if (node.did === did) {
              return { ...node, ...newNode };
            }
            return node;
          });
        });
      },
      remove: (did: string) => {
        setNodes((prevNodes) => {
          return prevNodes.filter((node) => node.did !== did);
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
