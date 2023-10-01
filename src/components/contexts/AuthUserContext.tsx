"use client";
import React from "react";

export const AuthUserContext = React.createContext<string | undefined>(
  undefined
);

export function useAuthUser() {
  const authUser = React.useContext(AuthUserContext);
  if (typeof authUser === "undefined") {
    throw new Error("useAuthUser must be used within a AuthUserContext");
  }
  return authUser;
}

export const AuthUserProvider = AuthUserContext.Provider;
