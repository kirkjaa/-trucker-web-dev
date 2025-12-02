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
      <main className="bg-background-inside dark:bg-neutral-00 text-main-01 h-sreen w-screen bg-cover bg-center bg-no-repeat p-5 transition-colors duration-300">
        <div className="shadow-main bg-white/80 dark:bg-neutral-01/90 p-5 rounded-2xl w-full transition-colors duration-300">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
