import React, { PropsWithChildren } from "react";

export default function BlockQuote({ children }: PropsWithChildren<{}>) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
  );
}
