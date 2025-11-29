import React from "react";

import AdminSidebar from "@/app/components/ui/sidebar/AdminSidebar";
import { SidebarProvider } from "@/app/components/ui/sidebar/sidebar";
type Props = {
  children: React.ReactNode;
};

export default function AdminLayOut({ children }: Props) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="bg-background-inside text-main-01 h-sreen w-screen bg-cover bg-center bg-no-repeat p-5">
        <div className="shadow-main bg-white/80 p-5 rounded-2xl w-full">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
