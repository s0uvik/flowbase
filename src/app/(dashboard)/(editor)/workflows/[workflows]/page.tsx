import { requireAuth } from "@/lib/auth-utils";
import React from "react";

type Props = {
  params: Promise<{ workflows: string }>;
};

const page = async ({ params }: Props) => {
  await requireAuth();

  const { workflows } = await params;
  return <div>{workflows}</div>;
};

export default page;
