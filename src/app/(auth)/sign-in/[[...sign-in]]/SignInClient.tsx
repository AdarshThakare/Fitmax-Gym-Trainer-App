"use client";
import dynamic from "next/dynamic";

const SignInUI = dynamic(() => import("./SignInUI"), { ssr: false });

export default function SignInWrapper() {
  return <SignInUI />;
}
