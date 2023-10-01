"use client";

import { redirect } from "next/navigation";
import { Fragment, useCallback } from "react";
import { useReadUser, useSetUser } from "@/components/contexts/UserContext";
import { Button } from "@/components/ui/Button";
import { useMagic } from "@/components/contexts/MagicContext";
import NavBar from "@/components/ui/NavBar";
import H4 from "@/components/ui/Typography/H4";
import LoginButton from "./LoginButton";
import { PersonIcon } from "@radix-ui/react-icons";

export default function Login() {
  const user = useReadUser();

  if (user) {
    return redirect("/");
  }

  return (
    <Fragment>
      <NavBar
        button={
          <Button variant="secondary" size="icon" disabled={true}>
            <PersonIcon className="h-5 w-5" />
          </Button>
        }
      />
      <main className="h-screen flex flex-1 items-center justify-center">
        <div className="flex flex-col gap-4">
          <H4>Click the button below to start</H4>
          <div className="flex-1 flex items-center justify-center">
            <LoginButton />
          </div>
        </div>
      </main>
    </Fragment>
  );
}
