"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "@/utils/firebase/auth";
import { useRouter } from "next/navigation";

export default function Auth() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user: any) => {
      if (user) {
        router.replace("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div>
      {/* Your auth UI here */}
    </div>
  );
}