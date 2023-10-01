import { CheckIcon } from "@radix-ui/react-icons";
import React from "react";

interface Props {
  status: boolean;
}
export default function VerifyStatus({ status }: Props) {
  return (
    <div className="flex items-center justify-end">
      <div className="rounded-full bg-green-500 p-0.5">
        <CheckIcon className="h-6 w-6 text-primary-foreground" />
      </div>
    </div>
  );
}
