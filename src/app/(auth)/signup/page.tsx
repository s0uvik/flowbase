import { SignupForm } from "@/features/auth/components/signup-form";
import { requireUnAuth } from "@/lib/auth-utils";
import React from "react";

const page = async () => {
  await requireUnAuth();
  return (
    <div>
      <SignupForm />
    </div>
  );
};

export default page;
