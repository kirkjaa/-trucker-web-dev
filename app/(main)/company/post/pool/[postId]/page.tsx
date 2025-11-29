import React from "react";

import PoolOfferListTable from "@/app/features/company/pool/components/PoolOfferListTable";

export default async function Page({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const postId = (await params).postId;
  return <PoolOfferListTable postId={postId} />;
}
