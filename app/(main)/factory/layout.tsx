import { FactorySidebar } from "@/app/components/ui/sidebar/FactorySidebar";
import { SidebarProvider } from "@/app/components/ui/sidebar/sidebar";

export default function FactoryLayOut({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <FactorySidebar />
      <main className="bg-background-inside text-main-01 h-sreen w-screen bg-cover bg-center bg-no-repeat p-5">
        <div className="shadow-main bg-white/80 p-5 rounded-2xl w-full">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
