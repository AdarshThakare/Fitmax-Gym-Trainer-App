"use client";
import { SignIn } from "@clerk/clerk-react";

export default function SignInUI() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignIn />
    </main>
  );
}
