"use client";

import { noop } from "@/lib/utils";
import React from "react";
import { useLocalStorage } from "usehooks-ts";

const userInitialState: string | undefined = undefined;

export const ReadUserContext = React.createContext<string | undefined>(
  userInitialState
);

export const SetUserContext =
  React.createContext<(value: string | undefined) => void>(noop);

export function useReadUser() {
  return React.useContext(ReadUserContext);
}

export function useSetUser() {
  return React.useContext(SetUserContext);
}

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useLocalStorage<string | undefined>(
    "userAddress",
    userInitialState
  );

  return (
    <ReadUserContext.Provider value={user}>
      <SetUserContext.Provider value={setUser}>
        {children}
      </SetUserContext.Provider>
    </ReadUserContext.Provider>
  );
}
