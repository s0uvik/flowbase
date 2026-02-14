import { requireAuth } from "@/lib/auth-utils";
import React from "react";

const page = async () => {
  await requireAuth();
  return <div>workflow</div>;
};

export default page;
