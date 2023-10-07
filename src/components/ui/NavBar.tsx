import React from "react";
import Large from "./Typography/Large";
import Image from "next/image";

interface Props {
  button: React.ReactNode;
}

export default function NavBar({ button }: Props) {
  return (
    <nav className="h-20 px-4 mb-4 flex items-center justify-center">
      <div className="flex-1 flex items-center">
        <Image
          className="border-1 border-slate-800 rounded-md mr-4"
          src="/images/logo.jpeg" // Route of the image file
          height={50} // Desired size with correct aspect ratio
          width={50} // Desired size with correct aspect ratio
          alt="ZkToro Logo"
        />
        <Large>zkToro</Large>
      </div>
      <div className="flex-1"></div>
      {button}
    </nav>
  );
}
