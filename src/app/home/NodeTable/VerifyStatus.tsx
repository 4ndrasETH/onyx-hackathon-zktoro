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
    return (
      <div className="flex items-center justify-end">
        <div className="rounded-full bg-slate-500 w-7 h-7 flex items-center justify-center">
          <ReloadIcon className="h-5 w-5 text-primary-foreground animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end" onClick={getVPAndVerify}>
      {status ? (
        <div className="rounded-full bg-green-500 p-0.5">
          <CheckIcon className="h-6 w-6 text-primary-foreground" />
        </div>
      ) : (
        <div className="rounded-full bg-red-500 p-0.5">
          <Cross2Icon className="h-6 w-6 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}
