import { requireAuth } from "@/lib/auth-utils";
import React from "react";

type Props = {
  params: Promise<{ credentialId: string }>;
};

const page = async ({ params }: Props) => {
  await requireAuth();

  const { credentialId } = await params;
  return <div>{credentialId}</div>;
};

export default page;
