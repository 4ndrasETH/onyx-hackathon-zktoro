import { PersonIcon } from "@radix-ui/react-icons";
import React from "react";
import { Button } from "./Button";
import Large from "./Typography/Large";

interface Props {
  button: React.ReactNode;
}

export default function NavBar({ button }: Props) {
  return (
    <nav className="h-12 px-4 flex items-center justify-center">
      <div className="flex-1" />
      <div className="flex-1">
        <Large>zkToro</Large>
      </div>
      {button}
    </nav>
  );
}
