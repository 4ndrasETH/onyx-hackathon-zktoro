import React, { PropsWithChildren } from "react";

export default function UL({ children }: PropsWithChildren<{}>) {
  return <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>;
}
