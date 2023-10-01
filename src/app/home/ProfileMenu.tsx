import { useAuthUser } from "@/components/contexts/AuthUserContext";
import { useMagic } from "@/components/contexts/MagicContext";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import Muted from "@/components/ui/Typography/Muted";
import { truncateAddress } from "@/lib/utils";
import { PersonIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";

export default function ProfileMenu() {
  const magic = useMagic();
  const { user, did } = useAuthUser();
  useEffect(() => {}, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon">
          <PersonIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="flex gap-4">
          <div>Address:</div>
          <div>{truncateAddress(user)}</div>
        </DropdownMenuLabel>
        <DropdownMenuLabel className="flex gap-4">
          <Muted>DID:</Muted>
          <Muted>{`${did.did.slice(0, 18)}...`}</Muted>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={magic.logout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
