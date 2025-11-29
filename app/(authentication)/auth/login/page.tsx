"use client";

import dynamic from "next/dynamic";

const LoginRender = dynamic(
  () => import("@/app/features/auth/loginForm/Index"),
  { ssr: false }
);

export default function Page() {
  return <LoginRender />;
}
