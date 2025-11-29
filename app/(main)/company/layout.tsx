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
      <main className="bg-background-inside text-neutral-08 h-sreen w-screen bg-cover bg-center bg-no-repeat p-5">
        <div className="shadow-main bg-white/80 p-5 rounded-2xl">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
