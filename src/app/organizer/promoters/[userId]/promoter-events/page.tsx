import OrganizerPromoterEvents from "@/components/roles/organizer/promoters/OrganizerPromoterEvents";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: number }>
}) {
  const { userId } = await params
  const promoterIdNumber = Number(userId);
  return <OrganizerPromoterEvents userId={promoterIdNumber} />
}