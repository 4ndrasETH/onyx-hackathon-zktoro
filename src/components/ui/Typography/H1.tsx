import React, { PropsWithChildren } from "react";

export default function H1({ children }: PropsWithChildren<{}>) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  );
}
