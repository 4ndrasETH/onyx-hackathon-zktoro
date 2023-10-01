import React, { PropsWithChildren } from "react";

export default function Large({ children }: PropsWithChildren<{}>) {
  return <div className="text-lg font-semibold">{children}</div>;
}
