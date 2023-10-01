import { useMagic } from "@/components/contexts/MagicContext";
import { useSetUser } from "@/components/contexts/UserContext";
import { Button } from "@/components/ui/Button";
import React, { useCallback, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/Toast/useToast";

export default function LoginButton() {
  const setUser = useSetUser();
  const magic = useMagic();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleClick = useCallback(async () => {
    setLoading(true);
    try {
      const accounts = await magic.connect();
      console.log("Logged in user:", accounts[0]);
      setUser(accounts[0]);
      setLoading(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      setLoading(false);
    }
  }, [setUser, magic, toast]);
  return (
    <Button disabled={loading} onClick={handleClick}>
      {loading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : null}
      Log In
    </Button>
  );
}
