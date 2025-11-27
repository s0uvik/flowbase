import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted w-screen h-screen flex justify-center items-center">
      <div className=" w-full max-w-sm p-3 sm:p-0">{children}</div>
    </div>
  );
};

export default AuthLayout;
