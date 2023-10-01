import React, { PropsWithChildren } from "react";

export default function H4({ children }: PropsWithChildren<{}>) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h4>
  );
}
