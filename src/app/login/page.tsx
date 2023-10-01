"use client";

import { redirect } from "next/navigation";
import { useCallback } from "react";
import { useReadUser, useSetUser } from "@/components/contexts/UserContext";
import { Button } from "@/components/ui/Button";
import { useMagic } from "@/components/contexts/MagicContext";

export default function Login() {
  const user = useReadUser();
  const setUser = useSetUser();
  const magic = useMagic();

  const handleClick = useCallback(async () => {
    const accounts = await magic.connect();
    console.log("Logged in user:", accounts[0]);
    setUser(accounts[0]);
  }, [setUser, magic]);

  if (user) {
    return redirect("/");
  }

  return <Button onClick={handleClick}>Log In</Button>;
}
