"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

import { auth } from "./firebase/config";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
  }, []);

  return user;
}