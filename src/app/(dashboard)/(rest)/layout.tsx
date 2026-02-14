import AppHeader from "@/components/app-header";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </>
  );
};

export default DashboardLayout;
