"use client";

import React from "react";
import { useSession } from "next-auth/react";

import AdminSidebar from "@/app/components/ui/sidebar/AdminSidebar";
import { CompanySidebar } from "@/app/components/ui/sidebar/CompanySidebar";
import { FactorySidebar } from "@/app/components/ui/sidebar/FactorySidebar";
import { SidebarProvider } from "@/app/components/ui/sidebar/sidebar";
import { ERoles } from "@/app/types/enum";

type Props = {
  children: React.ReactNode;
};

export default function LayOut({ children }: Props) {
  const { data: session } = useSession();

  const getSidebarComponent = () => {
    switch (session?.user?.role) {
      case ERoles.COMPANY:
        return <CompanySidebar />;
      case ERoles.FACTORY:
        return <FactorySidebar />;
      case ERoles.ADMIN:
        return <AdminSidebar />;
      default:
        return <AdminSidebar />;
    }
  };

  return (
    <SidebarProvider>
      {getSidebarComponent()}
      <main className="bg-background-inside text-main-01 h-screen w-screen bg-cover bg-center bg-no-repeat p-5">
        <div className="shadow-main bg-white/80 p-5 rounded-2xl w-full">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
