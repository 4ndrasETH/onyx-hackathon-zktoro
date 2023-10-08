import { delay } from "@/lib/utils";
import { CheckIcon, Cross2Icon, ReloadIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";

interface Props {
  status: boolean;
  vc?: string;
  updateNode: (verified: boolean) => void;
}
export default function VerifyStatus({ status, vc, updateNode }: Props) {
  const [loading, setLoading] = useState(false);

  const getVPAndVerify = async () => {
    if (!vc || status) return;
    setLoading(true);

    let newStatus = false;
    const newStatusRes = await fetch(`/api/vp`);
    const newStatusJson = await newStatusRes.json();
    if (newStatusJson.error) {
      console.error(newStatusJson.error);
    } else {
      newStatus = newStatusJson.status;
    }
    await delay(5000);
    updateNode(newStatus);
    setLoading(false);
  };

  useEffect(() => {
    getVPAndVerify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vc, status]);

  if (loading) {
    return <ReloadIcon className="h-5 w-5 text-primary animate-spin" />;
  }

  if (status) {
    return <CheckIcon className="h-6 w-6 text-green-500" />;
  }

  return (
    <Cross2Icon className="h-6 w-6 text-destructive" onClick={getVPAndVerify} />
  );
}
