import EditPromoter from "@/components/roles/organizer/EditPromoter";

export default async function Page({
  params,
}: {
  params: Promise<{ promoterId: number }>
}) {
  const { promoterId } = await params
  const promoterIdNumber = Number(promoterId);
  return <EditPromoter userId={promoterIdNumber} />
}