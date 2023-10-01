import React, { PropsWithChildren } from "react";

export default function Small({ children }: PropsWithChildren<{}>) {
  return <small className="text-sm font-medium leading-none">{children}</small>;
}
