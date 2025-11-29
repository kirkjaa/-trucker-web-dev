import ListOfRfqRender from "@/app/features/factory/rfq/list-of-rfq/Index";

// Force dynamic rendering to avoid build-time URL errors
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return <ListOfRfqRender />;
}
