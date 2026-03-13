"use client";
import { SignUp } from "@clerk/clerk-react";

export default function SignUpUI() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignUp />
    </main>
  );
}
