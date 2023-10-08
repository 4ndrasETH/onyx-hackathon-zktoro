import React from "react";
import useVerifyVP from "./useVerifyVP";
import useVerifyWorldId from "./useVerifyWorldId";
import { Node } from "../NodeTable";
import VerifyWithWorldcoinButton from "./VerifyWithWorldcoinButton";
import { useSetNodes } from "@/components/contexts/NodesContext";
import { CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import IssueProofFlow from "../IssueProofFlow";

export default function VerificationFlow({
  did,
  nullifierHash,
  vp,
  worldIdResult,
}: Pick<Node, "did" | "vp" | "worldIdResult" | "nullifierHash">) {
  const { update } = useSetNodes();

  // check vc validity
  const {
    verified: vpVerified,
    error: vpVerifyError,
    loading: vpVerifyLoading,
  } = useVerifyVP({ vp });

  // check world id validity
  const {
    verified: worldIdVerified,
    loading: worldIdVerifyLoading,
    error: worldIdVerifyError,
  } = useVerifyWorldId({ worldIdResult });

  // if something is loading -> show loading icon
  if (vpVerifyLoading || worldIdVerifyLoading) {
    return <ReloadIcon className="h-5 w-5 text-primary animate-spin" />;
  }

  // if !worldId show worldID button
  if (
    !worldIdResult ||
    !nullifierHash ||
    (!worldIdVerifyLoading && !worldIdVerified)
  ) {
    return (
      <VerifyWithWorldcoinButton
        updateNode={(worldIdResult, nullifierHash) => {
          console.log("update node", { worldIdResult, nullifierHash });
          update(did, { worldIdResult, nullifierHash });
        }}
      />
    );
  }

  // if !vc show vc button
  if (!vp || (!vpVerifyLoading && !vpVerified)) {
    return (
      <IssueProofFlow
        did={did}
        worldIdResult={worldIdResult}
        nullifierHash={nullifierHash}
        updateNode={(vp) => {
          update(did, { vp });
        }}
      />
    );
  }

  // if everything is verified -> show checkmark

  return <CheckIcon className="h-6 w-6 text-green-500" />;
}
