import { LoginForm } from "@/components/login-form";
import { requireUnAuth } from "@/lib/auth-utils";
import React from "react";

const page = async () => {
  await requireUnAuth();
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default page;
