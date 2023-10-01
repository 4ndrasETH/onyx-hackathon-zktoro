import React, { PropsWithChildren } from "react";

export default function Muted({ children }: PropsWithChildren<{}>) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
