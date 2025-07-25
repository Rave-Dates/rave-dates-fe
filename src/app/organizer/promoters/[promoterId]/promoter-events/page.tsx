import OrganizerPromoterEvents from "@/components/roles/organizer/promoters/OrganizerPromoterEvents";

export default async function Page({
  params,
}: {
  params: Promise<{ promoterId: number }>
}) {
  const { promoterId } = await params
  const promoterIdNumber = Number(promoterId);
  return <OrganizerPromoterEvents promoterId={promoterIdNumber} />
}