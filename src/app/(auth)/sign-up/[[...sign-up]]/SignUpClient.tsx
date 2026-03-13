"use client";
import dynamic from "next/dynamic";

const SignUpUI = dynamic(() => import("./SignUpUI"), { ssr: false });

export default function SignUpWrapper() {
  return <SignUpUI />;
}
