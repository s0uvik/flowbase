import prisma from "@/lib/db";
import React from "react";

const page = async () => {
  const user = await prisma.user.findMany();
  return <div>{JSON.stringify(user)}</div>;
};

export default page;
