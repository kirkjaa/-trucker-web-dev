import FactoriesAndCompaniesForm from "@/app/features/admin/organization/components/FactoriesAndCompaniesForm";

export default async function Page({
  params,
}: {
  params: Promise<{ factoriesId: string }>;
}) {
  const factoriesId = (await params).factoriesId;
  return (
    <FactoriesAndCompaniesForm
      title="รูปแบบ - โรงงาน"
      factoriesId={factoriesId}
    />
  );
}
