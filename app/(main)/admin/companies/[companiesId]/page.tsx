import FactoriesAndCompaniesForm from "@/app/features/admin/organization/components/FactoriesAndCompaniesForm";

export default async function Page({
  params,
}: {
  params: Promise<{ companiesId: string }>;
}) {
  const companiesId = (await params).companiesId;
  return (
    <FactoriesAndCompaniesForm
      title="รูปแบบ - บริษัท"
      companiesId={companiesId}
    />
  );
}
