import React, { PropsWithChildren } from "react";

export default function H2({ children }: PropsWithChildren<{}>) {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      {children}
    </h2>
  );
}
