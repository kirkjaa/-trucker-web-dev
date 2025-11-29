import DetailNavBar from "@/app/features/factory/rfq/list-of-rfq/components/DetailNavbar";

export default function LayOut({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col gap-4">
      <DetailNavBar />
      {children}
    </main>
  );
}
