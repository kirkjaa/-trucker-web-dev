import { CompanySidebar } from "@/app/components/ui/sidebar/CompanySidebar";
import { SidebarProvider } from "@/app/components/ui/sidebar/sidebar";

export default function CompanyLayOut({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <CompanySidebar />
      <main className="bg-background-inside dark:bg-neutral-00 text-neutral-08 h-sreen w-screen bg-cover bg-center bg-no-repeat p-5 transition-colors duration-300">
        <div className="shadow-main bg-white/80 dark:bg-neutral-01/90 p-5 rounded-2xl transition-colors duration-300">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
