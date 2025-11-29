import React from "react";

import UsersForm from "@/app/features/users/components/UsersForm";

export default async function Page({
  params,
}: {
  params: Promise<{ Id: string }>;
}) {
  const Id = (await params).Id;
  return <UsersForm id={Id} />;
}
